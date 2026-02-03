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
    private cartSubject = new BehaviorSubject<CartItem[]>([]);
    public cart$ = this.cartSubject.asObservable();

    private mockOrders: Order[] = [];

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private bookService: BookService
    ) { }

    getCart(): Observable<CartItem[]> {
        return of(this.cartSubject.value);
    }

    addToCart(item: AddToCartRequest): Observable<any> {
        return this.bookService.getBook(item.book_id).pipe(
            map(book => {
                const currentItems = this.cartSubject.value;
                const existingItemIndex = currentItems.findIndex(i => i.book_id === item.book_id);

                let updatedItems = [...currentItems];
                if (existingItemIndex > -1) {
                    updatedItems[existingItemIndex].quantity += item.quantity;
                    updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
                } else {
                    const newItem: CartItem = {
                        book_id: item.book_id,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.price * item.quantity,
                        book: book
                    };
                    updatedItems.push(newItem);
                }

                this.cartSubject.next(updatedItems);
                return { success: true, message: 'Added to cart' };
            })
        );
    }

    placeOrder(orderData: any): Observable<any> {
        const order: Order = {
            id: Math.random().toString(36).substr(2, 9),
            user_id: 'user-123', // mock
            items: this.cartSubject.value.map(c => ({
                book_id: c.book_id,
                title: c.book?.title || 'Unknown',
                quantity: c.quantity,
                price: c.price,
                total: c.total,
                seller_id: 'seller-1'
            })),
            total_price: this.cartSubject.value.reduce((acc, curr) => acc + curr.total, 0),
            payment_method: orderData.payment_method,
            shipping_address: orderData.shipping_address,
            seller_address: { city: 'Mock City', state: 'Mock State', country: 'Mock Country', pincode: '000000' },
            status: 'placed',
            created_at: new Date().toISOString()
        };
        this.mockOrders.push(order);
        this.cartSubject.next([]); // Clear cart locally
        return of({ success: true, order_id: order.id });
    }

    getOrders(): Observable<Order[]> {
        return of(this.mockOrders);
    }

    getOrder(id: string): Observable<Order> {
        return of(this.mockOrders.find(o => o.id === id) as Order);
    }
}

