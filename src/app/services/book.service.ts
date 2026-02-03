import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiUrl = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    // User routes
    getBooks(): Observable<Book[]> {
        return this.http.get<any>(`${this.apiUrl}/user/books`).pipe(
            map(res => res.message || [])
        );
    }

    getBook(id: string): Observable<Book> {
        return this.http.get<any>(`${this.apiUrl}/user/book/${id}`).pipe(
            map(res => res.message)
        );
    }

    // Admin routes
    getAdminBooks(): Observable<Book[]> {
        return this.http.get<any>(`${this.apiUrl}/admin/books`).pipe(
            map(res => res.message || [])
        );
    }

    getAdminBook(id: string): Observable<Book> {
        return this.http.get<any>(`${this.apiUrl}/admin/book/${id}`).pipe(
            map(res => res.message)
        );
    }

    createBook(book: Book): Observable<any> {
        return this.http.post(`${this.apiUrl}/admin/book`, book);
    }

    updateBook(book: Book): Observable<any> {
        return this.http.put(`${this.apiUrl}/admin/book`, book);
    }

    deleteBook(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/admin/book/${id}`);
    }

    updateBookStatus(id: string, status: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/admin/book/status`, { id, status });
    }
}
