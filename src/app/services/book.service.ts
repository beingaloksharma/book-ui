import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiUrl = '/api'; // Use relative path for proxy

    constructor(private http: HttpClient) { }

    // Headers are now handled by AuthInterceptor
    getBooks(): Observable<Book[]> {
        // User route for listing books: /user/books (based on router.go)
        return this.http.get<Book[]>(`${this.apiUrl}/user/books`);
    }

    getBook(id: string): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/user/book/${id}`);
    }

    // Admin routes
    createBook(book: Book): Observable<any> {
        return this.http.post(`${this.apiUrl}/admin/book`, book);
    }

    updateBook(book: Book): Observable<any> {
        return this.http.put(`${this.apiUrl}/admin/book`, book);
    }

    deleteBook(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/admin/book/${id}`);
    }
}
