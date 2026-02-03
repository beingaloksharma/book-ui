import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, switchMap, map, tap, of } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080';
    private tokenKey = 'auth_token';
    private userKey = 'user_info';

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage() {
        const userStr = localStorage.getItem(this.userKey);
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                this.currentUserSubject.next(user);
            } catch (e) {
                console.error('Error parsing user from storage', e);
            }
        }
    }

    login(credentials: { username: string, password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            switchMap((response: any) => {
                // Backend returns SuccessDTO: { success_code, success_message, message: { token: "...", role: "..." } }
                if (response && response.message && response.message.token) {
                    const data = response.message;
                    localStorage.setItem(this.tokenKey, data.token);

                    // Fetch profile to get user details and role
                    return this.fetchUserProfile(data.role || 'user');
                }
                throw new Error('Invalid login response');
            })
        );
    }

    // Helper fetch user profile method
    fetchUserProfile(role?: string): Observable<User> {
        // Try /user/profile to get current user details
        return this.http.get<any>(`${this.apiUrl}/${role}/profile`).pipe(
            map(response => {
                // response.message is ResponseUserDTO
                // dtos.ResponseUserDTO { ID, Name, Email, Address, Username, Status }
                // Frontend User model has: { id, name, email, address, created_at, updated_at, username, status, type, orders }
                const userDTO = response.message;
                const user: User = {
                    ...userDTO,
                    created_at: '', // Not in ResponseUserDTO
                    updated_at: '', // Not in ResponseUserDTO
                    role: role || 'user', // Use passed role or default to 'user'
                    orders: []
                };
                return user;
            }),
            tap(user => {
                localStorage.setItem(this.userKey, JSON.stringify(user));
                this.currentUserSubject.next(user);
            })
        );
    }

    register(user: User): Observable<any> {
        // Map to RequestUserDTO: name, email, password, username
        const payload = {
            name: user.name,
            email: user.email,
            password: user.password,
            username: user.username
        };
        return this.http.post(`${this.apiUrl}/signup`, payload);
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        const user = this.currentUserSubject.value;
        return user?.role === 'admin' || user?.role === 'superadmin';
    }

    forgotPassword(email: string): Observable<any> {
        // Mock implementation as endpoint is not available
        return of({ success: true, message: 'Password reset link sent' });
    }
}
