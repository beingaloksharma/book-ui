import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AddToCartRequest, Order } from '../models/order.model';
import { Book } from '../models/book.model';

export interface CartItem {
    book_id: string;
    quantity: number;
    price: number;
    total: number;
    book?: Book; // Populated on frontend if needed
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    constructor(
        private http: HttpClient
    ) { }

    getCart(): Observable<CartItem[]> {
        return this.http.get<any>(`${this.apiUrl}/user/cart`).pipe(
            map(res => res.message ? res.message : [])
        );
    }

    addToCart(item: AddToCartRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/user/cart`, item);
    }

    placeOrder(orderData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/user/order`, orderData);
    }

    getOrders(): Observable<Order[]> {
        return this.http.get<any>(`${this.apiUrl}/user/orders`).pipe(
            map(res => res.message ? res.message : [])
        );
    }

    getOrder(id: string): Observable<Order> {
        return this.http.get<any>(`${this.apiUrl}/user/order/${id}`).pipe(
            map(res => res.message)
        );
    }

    private apiUrl = 'http://localhost:8080';

}

