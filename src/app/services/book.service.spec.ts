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
        const dummyBooks: Book[] = [
            { id: '1', title: 'Start with Why', author: 'Simon Sinek', price: 20, stock: 10, page_count: 200, status: 'active', tags: [], language: [], description: 'desc', isbn: '111' },
            { id: '2', title: 'Zero to One', author: 'Peter Thiel', price: 25, stock: 5, page_count: 150, status: 'active', tags: [], language: [], description: 'desc', isbn: '222' }
        ];

        service.getBooks().subscribe(books => {
            expect(books.length).toBe(2);
            expect(books).toEqual(dummyBooks);
        });

        const req = httpMock.expectOne('http://127.0.0.1:8080/user/books');
        expect(req.request.method).toBe('GET');
        req.flush(dummyBooks);
    });

    it('should fetch a single book (user route)', () => {
        const dummyBook: Book = { id: '1', title: 'Start with Why', author: 'Simon Sinek', price: 20, stock: 10, page_count: 200, status: 'active', tags: [], language: [], description: 'desc', isbn: '111' };

        service.getBook('1').subscribe(book => {
            expect(book).toEqual(dummyBook);
        });

        const req = httpMock.expectOne('http://127.0.0.1:8080/user/book/1');
        expect(req.request.method).toBe('GET');
        req.flush(dummyBook);
    });

    it('should fetch books (admin route)', () => {
        const dummyBooks: Book[] = [
            { id: '1', title: 'Start with Why', author: 'Simon Sinek', price: 20, stock: 10, page_count: 200, status: 'active', tags: [], language: [], description: 'desc', isbn: '111' },
            { id: '2', title: 'Zero to One', author: 'Peter Thiel', price: 25, stock: 5, page_count: 150, status: 'active', tags: [], language: [], description: 'desc', isbn: '222' }
        ];

        service.getAdminBooks().subscribe(books => {
            expect(books.length).toBe(2);
            expect(books).toEqual(dummyBooks);
        });

        const req = httpMock.expectOne('http://127.0.0.1:8080/admin/books');
        expect(req.request.method).toBe('GET');
        req.flush(dummyBooks);
    });

    it('should fetch a single book (admin route)', () => {
        const dummyBook: Book = { id: '1', title: 'Start with Why', author: 'Simon Sinek', price: 20, stock: 10, page_count: 200, status: 'active', tags: [], language: [], description: 'desc', isbn: '111' };

        service.getAdminBook('1').subscribe(book => {
            expect(book).toEqual(dummyBook);
        });

        const req = httpMock.expectOne('http://127.0.0.1:8080/admin/book/1');
        expect(req.request.method).toBe('GET');
        req.flush(dummyBook);
    });

    it('should create a book (admin route)', () => {
        const newBook: Book = { id: '3', title: 'New Book', author: 'Me', price: 10, stock: 100, page_count: 300, status: 'active', tags: [], language: [], description: 'desc', isbn: '333' };

        service.createBook(newBook).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('http://127.0.0.1:8080/admin/book');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newBook);
        req.flush({ message: 'Book created successfully' });
    });

    it('should update a book (admin route)', () => {
        const updatedBook: Book = { id: '1', title: 'Updated Title', author: 'Simon Sinek', price: 22, stock: 9, page_count: 200, status: 'active', tags: [], language: [], description: 'desc', isbn: '111' };

        service.updateBook(updatedBook).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('http://127.0.0.1:8080/admin/book');
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updatedBook);
        req.flush({ message: 'Book updated successfully' });
    });

    it('should delete a book (admin route)', () => {
        service.deleteBook('1').subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('http://127.0.0.1:8080/admin/book/1');
        expect(req.request.method).toBe('DELETE');
        req.flush({ message: 'Book deleted successfully' });
    });
});
