import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService, CartItem } from './cart.service';
import { AuthService } from './auth.service';
import { BookService } from './book.service';
import { Order } from '../models/order.model';
import { of } from 'rxjs';

describe('CartService', () => {
    let service: CartService;
    let httpMock: HttpTestingController;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let bookServiceSpy: jasmine.SpyObj<BookService>;

    beforeEach(() => {
        const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);
        const bookSpy = jasmine.createSpyObj('BookService', ['getBook']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CartService,
                { provide: AuthService, useValue: authSpy },
                { provide: BookService, useValue: bookSpy }
            ]
        });
        service = TestBed.inject(CartService);
        httpMock = TestBed.inject(HttpTestingController);
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        bookServiceSpy = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch cart items', () => {
        const dummyCartResponse = {
            data: [
                { book_id: '1', quantity: 2, price: 10, total: 20 }
            ]
        };
        const dummyBook = { id: '1', title: 'Test Book', author: 'Test Author', price: 10, stock: 5, page_count: 100, status: 'active', tags: [], language: [], description: 'desc', isbn: '123' };

        bookServiceSpy.getBook.and.returnValue(of(dummyBook));

        service.getCart().subscribe(items => {
            expect(items.length).toBe(1);
            expect(items[0].book).toEqual(dummyBook);
        });

        const req = httpMock.expectOne('http://127.0.0.1:8080/user/cart');
        expect(req.request.method).toBe('GET');
        req.flush(dummyCartResponse);
    });

    it('should add item to cart', () => {
        const itemToAdd = { book_id: '1', quantity: 1, user_id: 'user1', price: 10 };

        // Mock getCart call that happens after addToCart
        bookServiceSpy.getBook.and.returnValue(of({ id: '1', title: 'Test', author: 'A', price: 10, stock: 5, page_count: 10, status: 'active', tags: [], language: [], description: 'desc', isbn: '123' }));

        service.addToCart(itemToAdd).subscribe(res => {
            // success
        });

        const postReq = httpMock.expectOne('http://127.0.0.1:8080/user/cart');
        expect(postReq.request.method).toBe('POST');
        postReq.flush({ message: 'Added' });

        const getReq = httpMock.expectOne('http://127.0.0.1:8080/user/cart');
        getReq.flush({ data: [] });
    });

    it('should place order', () => {
        const orderData = { address: { city: 'NY', state: 'NY', country: 'USA', pincode: '10001' } };

        service.placeOrder(orderData).subscribe(() => {
            // success
        });

        const req = httpMock.expectOne('http://127.0.0.1:8080/user/order');
        expect(req.request.method).toBe('POST');
        req.flush({ message: 'Order placed' });
    });

    it('should fetch orders', () => {
        const dummyOrders: Order[] = [{
            id: '1', items: [], total_price: 100, status: 'pending', created_at: '',
            user_id: '1', payment_method: 'card',
            shipping_address: { city: '', state: '', country: '', pincode: '' },
            seller_address: { city: '', state: '', country: '', pincode: '' }
        }];

        service.getOrders().subscribe(orders => {
            expect(orders.length).toBe(1);
        });

        const req = httpMock.expectOne('http://127.0.0.1:8080/user/orders');
        expect(req.request.method).toBe('GET');
        req.flush(dummyOrders);
    });
});
