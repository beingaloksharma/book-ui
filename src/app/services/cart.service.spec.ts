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
        service.getCart().subscribe(items => {
            expect(items).toBeDefined();
        });
    });

    it('should add item to cart', () => {
        const itemToAdd = { book_id: '1', quantity: 1, user_id: 'user1', price: 10 };
        const dummyBook = { id: '1', title: 'Test Book', author: 'Test Author', price: 10, stock: 5, page_count: 100, status: 'active', tags: [], language: [], description: 'desc', isbn: '123' };

        bookServiceSpy.getBook.and.returnValue(of(dummyBook));

        service.addToCart(itemToAdd).subscribe(res => {
            expect(res.success).toBeTrue();
        });
    });

    it('should place order', () => {
        const orderData = { address: { city: 'NY', state: 'NY', country: 'USA', pincode: '10001' } };

        service.placeOrder(orderData).subscribe(res => {
            expect(res.success).toBeTrue();
        });
    });

    it('should fetch orders', () => {
        service.getOrders().subscribe(orders => {
            expect(orders).toBeDefined();
        });
    });
});
