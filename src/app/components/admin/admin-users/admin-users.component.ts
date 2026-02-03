import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule, MatExpansionModule, MatButtonModule, MatIconModule, MatChipsModule],
    templateUrl: './admin-users.component.html',
    styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
    users: User[] = [];
    loading = true;

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers() {
        this.adminService.getUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
            }
        });
    }

    toggleStatus(user: User) {
        const newStatus = user.status === 'active' ? 'blocked' : 'active';
        const actionText = user.status === 'active' ? 'Block' : 'Unblock';

        Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to ${actionText.toLowerCase()} this user?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: user.status === 'active' ? '#ef4444' : '#10b981',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${actionText}!`
        }).then((result) => {
            if (result.isConfirmed) {
                this.adminService.updateUserStatus(user.id, newStatus).subscribe({
                    next: () => {
                        user.status = newStatus;
                        Swal.fire(
                            'Updated!',
                            `User has been ${newStatus}.`,
                            'success'
                        );
                    },
                    error: (err) => {
                        Swal.fire(
                            'Error!',
                            'Failed to update user status.',
                            'error'
                        );
                    }
                });
            }
        });
    }
}
