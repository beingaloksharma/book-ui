import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, switchMap, forkJoin, map, of } from 'rxjs';
import { AuthService } from './auth.service';
import { AddToCartRequest, Order } from '../models/order.model';
import { BookService } from './book.service';
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
    private apiUrl = 'http://127.0.0.1:8080';
    private cartSubject = new BehaviorSubject<CartItem[]>([]);
    public cart$ = this.cartSubject.asObservable();

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private bookService: BookService
    ) { }

    getCart(): Observable<CartItem[]> {
        return this.http.get<any>(`${this.apiUrl}/user/cart`).pipe(
            map(response => {
                // Backend returns wrapped response: { data: [...] }
                const items: CartItem[] = response.data || [];
                return items;
            }),
            switchMap(items => {
                // If items don't have book details (title, etc), fetch them
                if (items.length === 0) return of([]);

                const fileRequests = items.map(item =>
                    this.bookService.getBook(item.book_id).pipe(
                        map(book => ({ ...item, book }))
                    )
                );
                return forkJoin(fileRequests);
            }),
            tap(items => this.cartSubject.next(items))
        );
    }

    addToCart(item: AddToCartRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/user/cart`, item).pipe(
            tap(() => {
                // Refresh cart after adding
                this.getCart().subscribe();
            })
        );
    }

    placeOrder(orderData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/user/order`, orderData).pipe(
            tap(() => {
                this.cartSubject.next([]); // Clear cart locally
            })
        );
    }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/user/orders`);
    }

    getOrder(id: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/user/order/${id}`);
    }
}

