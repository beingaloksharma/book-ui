import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { Order } from '../../../models/order.model';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-user-orders',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './user-orders.component.html',
    styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
    orders: Order[] = [];
    loading = true;

    constructor(private cartService: CartService) { }

    ngOnInit(): void {
        this.cartService.getOrders().subscribe({
            next: (data) => {
                // Sort by date desc
                this.orders = (data || []).sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
            }
        });
    }
}
