import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AddToCartRequest, Order } from '../models/order.model';
import { Book } from '../models/book.model';

export interface CartItem {
    id: number;
    book_id: string;
    quantity: number;
    price: number;
    total: number;
    book?: Book;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private apiUrl = 'http://localhost:8080/api';

    constructor(
        private http: HttpClient
    ) { }

    getCart(): Observable<CartItem[]> {
        return this.http.get<any>(`${this.apiUrl}/cart`).pipe(
            map(res => {
                // Backend returns the Cart object with Items array
                // If the response is the Cart object directly:
                if (res && res.Items) {
                    return res.Items;
                }
                // If wrapped in message or other structure, adjust here.
                // Based on controller GetCart returning model.Cart directly.
                return res.Items || [];
            })
        );
    }

    addToCart(item: AddToCartRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/cart`, item);
    }

    removeFromCart(itemId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/cart/items/${itemId}`);
    }

    placeOrder(orderData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/orders`, orderData);
    }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders`);
    }

    getOrder(id: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
    }
}

