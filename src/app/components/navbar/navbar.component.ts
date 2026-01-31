import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    currentUser$: Observable<User | null>;
    isMenuOpen = false;

    constructor(private authService: AuthService) {
        this.currentUser$ = this.authService.currentUser$;
    }

    logout() {
        this.authService.logout();
        this.isMenuOpen = false;
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    get isAdmin(): boolean {
        return this.authService.isAdmin();
    }
}
