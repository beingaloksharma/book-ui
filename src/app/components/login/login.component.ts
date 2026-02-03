import { Component } from '@angular/core';
// Rebuild trigger 2
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-login',
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
                this.router.navigate(['/user/booklist']);
            }
        }
    }

    onSubmit(): void {
        if (!this.username || !this.password) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Inputs',
                text: 'Please enter both username and password'
            });
            return;
        }

        this.loading = true;
        this.authService.login({ username: this.username, password: this.password }).subscribe({
            next: (res) => {
                this.loading = false;

                if (res) {
                    const isAdmin = this.authService.isAdmin();
                    console.log(`User/Admin check: Is Admin? ${isAdmin}`);

                    Swal.fire({
                        icon: 'success',
                        title: 'Welcome Back!',
                        text: 'Login successful',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        if (isAdmin) {
                            console.log("Redirecting to /admin/books");
                            this.router.navigate(['/admin/books']);
                        } else {
                            console.log("Redirecting to /user/booklist");
                            this.router.navigate(['/user/booklist']);
                        }
                    });
                } else {
                    console.warn("Error Occured :: ", res);
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Error',
                        text: 'Invalid Credentials'
                    });
                    this.authService.logout();
                }
            },
            error: (err) => {
                console.error("Login Error:", err);
                this.loading = false;
                this.error = 'Invalid credentials or server error';
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: this.error
                });
            }
        });
    }
}

