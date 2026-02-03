import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent {
    user: User = {
        id: '',
        name: '',
        email: '',
        username: '',
        type: 'user',
        status: 'active',
        created_at: '',
        updated_at: '',
        orders: [],
        address: []
    };
    password = '';
    loading = false;
    error = '';

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        this.loading = true;
        this.error = '';

        // Combine user data with password (backend expects password in the body)
        // The user interface in frontend model doesn't usually have password, 
        // but for signup payload we need to send it.
        // We'll cast to any for the payload
        const payload = {
            ...this.user,
            password: this.password
        };

        this.authService.register(payload as any).subscribe({
            next: (res) => {
                console.log("Signup Successful:", res);
                Swal.fire({
                    icon: 'success',
                    title: 'Account Created!',
                    text: 'Please login to continue.',
                    confirmButtonColor: '#6366f1'
                }).then(() => {
                    this.router.navigate(['/login']);
                });
            },
            error: (err) => {
                console.error("Signup Failed:", err);
                this.loading = false;
                this.error = err.error?.message || 'Failed to create account. Please try again.';

                Swal.fire({
                    icon: 'error',
                    title: 'Signup Failed',
                    text: this.error,
                    confirmButtonColor: '#ef4444'
                });
            }
        });
    }
}

