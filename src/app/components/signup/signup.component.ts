import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
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
        address: {
            city: '',
            state: '',
            country: '',
            pincode: ''
        }
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
            next: () => {
                alert('Account created successfully! Please login.');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.error = err.error?.message || 'Failed to create account. Please try again.';
            }
        });
    }
}
