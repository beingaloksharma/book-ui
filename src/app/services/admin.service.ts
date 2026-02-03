import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'http://localhost:8080/admin';

    constructor(private http: HttpClient) { }

    // User Management
    getUsers(): Observable<User[]> {
        return this.http.get<any>(`${this.apiUrl}/users`).pipe(
            map(res => res.message || [])
        );
    }

    getUser(id: string): Observable<User> {
        return this.http.get<any>(`${this.apiUrl}/user/${id}`).pipe(
            map(res => res.message)
        );
    }

    updateUserStatus(id: string, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/user/status`, { id, status });
    }

    // Order Management
    getOrders(): Observable<Order[]> {
        return this.http.get<any>(`${this.apiUrl}/orders`).pipe(
            map(res => res.message || [])
        );
    }

    getOrder(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/order/${id}`);
    }

    updateOrderStatus(orderId: string, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/order/status`, { order_id: orderId, status });
    }

    // Dashboard
    getDashboardStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/dashboard`);
    }
}
