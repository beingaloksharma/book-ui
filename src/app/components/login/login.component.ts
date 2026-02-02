import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username = '';
    password = '';
    error = '';
    loading = false;

    constructor(private authService: AuthService, private router: Router) {
        if (this.authService.isLoggedIn()) {
            if (this.authService.isAdmin()) {
                this.router.navigate(['/admin/books']);
            } else {
                this.router.navigate(['/user/books']);
            }
        }
    }

    onSubmit(): void {
        if (!this.username || !this.password) {
            this.error = 'Please enter both username and password';
            return;
        }

        this.loading = true;
        this.authService.login({ username: this.username, password: this.password }).subscribe({
            next: (res) => {
                console.log("After Login :: ", res);
                this.loading = false;

                if (res) {
                    if (this.authService.isAdmin()) {
                        this.router.navigate(['/admin/books']);
                    } else {
                        this.router.navigate(['/user/books']);
                    }
                } else {
                    this.error = 'Account is not active';
                    this.authService.logout(); // Logout if not active
                }
            },
            error: (err) => {
                this.loading = false;
                this.error = 'Invalid credentials';
                console.error(err);
            }
        });
    }
}
