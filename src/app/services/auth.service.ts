import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/';
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
            tap((response: any) => {
                if (response && response.token) {
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.setItem(this.tokenKey, response.token);
                    }
                    // Fetch user profile immediately after login to populate currentUser
                    this.fetchUserProfile().subscribe();
                }
            })
        );
    }

    // Helper fetch user profile method - requires an endpoint that returns current user
    fetchUserProfile(): Observable<User> {
        // Based on router.go: user.GET(constants.PROFILE, app.UserProfile) -> /user/profile
        return this.http.get<User>(`${this.apiUrl}/user/profile`, {
            headers: { 'Authorization': `Bearer ${this.getToken()}` }
        }).pipe(
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
