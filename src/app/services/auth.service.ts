import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, switchMap, of, map } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://127.0.0.1:8080';
    private tokenKey = 'auth_token';
    private userKey = 'user_info';

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage() {
        if (isPlatformBrowser(this.platformId)) {
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
    }

    login(credentials: { username: string, password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            switchMap((response: any) => {
                // Backend returns data in 'message' field as a map: { token, role, status }
                if (response && response.message && response.message.token) {
                    const data = response.message;
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.setItem(this.tokenKey, data.token);
                        localStorage.setItem('user_role', data.role);
                    }
                    // Fetch and return user profile
                    return this.fetchUserProfile(data.role);
                }
                return of(null);
            })
        );
    }

    // Helper fetch user profile method
    fetchUserProfile(role?: string): Observable<User> {
        if (!role && isPlatformBrowser(this.platformId)) {
            role = localStorage.getItem('user_role') || 'user';
        }

        const endpoint = role === 'admin' || role === 'superadmin'
            ? `${this.apiUrl}/admin/profile`
            : `${this.apiUrl}/user/profile`;

        return this.http.get<any>(endpoint).pipe(
            map(response => {
                if (role === 'admin' || role === 'superadmin') {
                    // Admin endpoint returns User object directly in message
                    return response.message as User;
                } else {
                    // User endpoint returns { user_profile: User, orders: [] } in message
                    const data = response.message;
                    const user = data.user_profile as User;
                    if (user) {
                        user.orders = data.orders; // Attach orders if available
                    }
                    return user;
                }
            }),
            tap(user => {
                if (isPlatformBrowser(this.platformId)) {
                    localStorage.setItem(this.userKey, JSON.stringify(user));
                }
                this.currentUserSubject.next(user);
            })
        );
    }

    register(user: User): Observable<any> {
        return this.http.post(`${this.apiUrl}/signup`, user);
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);
        }
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.tokenKey);
        }
        return null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        const user = this.currentUserSubject.value;
        return user?.type === 'admin' || user?.type === 'superadmin';
    }
}
