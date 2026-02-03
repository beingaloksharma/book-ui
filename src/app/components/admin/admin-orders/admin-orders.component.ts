import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { Order } from '../../../models/order.model';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="container page-content">
            <h2>Order Management</h2>
            <div *ngIf="loading" class="text-center">Loading orders...</div>

            <div *ngIf="!loading" class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let order of orders">
                            <td>{{ order.id }}</td>
                            <td>
                                <div *ngFor="let item of order.items">
                                    {{ item.quantity }}x {{ item.title }}
                                </div>
                            </td>
                            <td>$ {{ order.total_price }}</td>
                            <td>
                                <span class="badge" [ngClass]="getStatusClass(order.status)">
                                    {{ order.status }}
                                </span>
                            </td>
                            <td>{{ order.created_at | date }}</td>
                            <td>
                                <select (change)="updateStatus(order, $event)" [value]="order.status">
                                    <option value="placed">Placed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    styles: [`
        .page-content { padding-top: 2rem; }
        .table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8em; }
        .status-placed { background: #e0f2fe; color: #0369a1; }
        .status-shipped { background: #fef3c7; color: #d97706; }
        .status-delivered { background: #dcfce7; color: #15803d; }
        .status-cancelled { background: #fee2e2; color: #b91c1c; }
    `]
})
export class AdminOrdersComponent implements OnInit {
    orders: Order[] = [];
    loading = true;

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders() {
        this.adminService.getOrders().subscribe({
            next: (data) => {
                this.orders = data;
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
            }
        });
    }

    getStatusClass(status: string): string {
        return `status-${status.toLowerCase()}`;
    }

    updateStatus(order: Order, event: any) {
        const newStatus = event.target.value;
        this.adminService.updateOrderStatus(order.id, newStatus).subscribe({
            next: () => {
                order.status = newStatus;
            },
            error: (err) => alert('Failed to update status')
        });
    }
}
