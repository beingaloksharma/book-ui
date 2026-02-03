import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookService } from './book.service';
import { Book } from '../models/book.model';

describe('BookService', () => {
    let service: BookService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BookService]
        });
        service = TestBed.inject(BookService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch books (user route)', () => {
        service.getBooks().subscribe(books => {
            expect(books.length).toBeGreaterThan(0);
        });
    });

    it('should fetch a single book (user route)', () => {
        service.getBook('1').subscribe(book => {
            expect(book).toBeTruthy();
            expect(book.id).toBe('1');
        });
    });

    it('should fetch books (admin route)', () => {
        service.getAdminBooks().subscribe(books => {
            expect(books.length).toBeGreaterThan(0);
        });
    });

    it('should fetch a single book (admin route)', () => {
        service.getAdminBook('1').subscribe(book => {
            expect(book).toBeTruthy();
            expect(book.id).toBe('1');
        });
    });

    it('should create a book (admin route)', () => {
        const newBook: Book = { id: '3', title: 'New Book', author: 'Me', price: 10, stock: 100, page_count: 300, status: 'active', tags: [], language: [], description: 'desc', isbn: '333' };

        service.createBook(newBook).subscribe(response => {
            expect(response.success).toBeTrue();
        });
    });

    it('should update a book (admin route)', () => {
        // Need existing book
        const updatedBook: Book = { id: '1', title: 'Updated Title', author: 'Simon Sinek', price: 22, stock: 9, page_count: 200, status: 'active', tags: [], language: [], description: 'desc', isbn: '111' };

        service.updateBook(updatedBook).subscribe(response => {
            expect(response.success).toBeTrue();
        });
    });

    it('should delete a book (admin route)', () => {
        service.deleteBook('1').subscribe(response => {
            expect(response.success).toBeTrue();
        });
    });
});
