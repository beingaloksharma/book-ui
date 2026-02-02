import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiUrl = 'http://127.0.0.1:8080';

    constructor(private http: HttpClient) { }

    // Headers are now handled by AuthInterceptor
    getBooks(): Observable<Book[]> {
        // User route for listing books: /user/books
        return this.http.get<Book[]>(`${this.apiUrl}/user/books`);
    }

    getAdminBooks(): Observable<Book[]> {
        // Admin route for listing books: /admin/books
        return this.http.get<Book[]>(`${this.apiUrl}/admin/books`);
    }

    getBook(id: string): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/user/book/${id}`);
    }

    getAdminBook(id: string): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/admin/book/${id}`);
    }

    // Admin routes
    createBook(book: Book): Observable<any> {
        return this.http.post(`${this.apiUrl}/admin/book`, book);
    }

    updateBook(book: Book): Observable<any> {
        return this.http.put(`${this.apiUrl}/admin/book`, book);
    }

    // Assuming endpoint is DELETE /admin/book/:id
    deleteBook(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/admin/book/${id}`);
    }
}
