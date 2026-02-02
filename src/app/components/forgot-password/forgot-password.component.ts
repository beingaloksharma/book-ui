import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
    email = '';
    loading = false;
    message = '';
    error = '';

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        if (!this.email) {
            this.error = 'Please enter your email address';
            return;
        }

        this.loading = true;
        this.error = '';
        this.message = '';

        console.log(`ForgotPasswordComponent: Submitting reset request for ${this.email}`);

        this.authService.forgotPassword(this.email).subscribe({
            next: (res) => {
                console.log("ForgotPasswordComponent: Success response", res);
                this.loading = false;
                this.message = 'If an account exists with this email, you will receive a password reset link shortly.';
            },
            error: (err) => {
                console.error("ForgotPasswordComponent: Error", err);
                this.loading = false;
                this.error = 'Something went wrong. Please try again later.';
            }
        });
    }
}
