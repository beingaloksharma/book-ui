import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-admin-book-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './admin-book-list.component.html',
    styleUrls: ['./admin-book-list.component.css']
})
export class AdminBookListComponent implements OnInit {
    books: Book[] = [];
    loading = true;

    constructor(private bookService: BookService) { }

    ngOnInit(): void {
        this.loadBooks();
    }

    loadBooks() {
        this.bookService.getAdminBooks().subscribe({
            next: (data) => {
                this.books = data;
                this.loading = false;
            },
            error: (err) => console.error(err)
        });
    }

    deleteBook(id: string) {
        if (confirm('Are you sure you want to delete this book?')) {
            this.bookService.deleteBook(id).subscribe({
                next: () => {
                    this.books = this.books.filter(b => b.id !== id);
                },
                error: (err) => alert('Failed to delete book')
            });
        }
    }

    updateStatus(book: Book) {
        const newStatus = book.status === 'active' ? 'inactive' : 'active';
        this.bookService.updateBookStatus(book.id, newStatus).subscribe({
            next: () => {
                book.status = newStatus;
            },
            error: (err) => {
                console.error(err);
                alert('Failed to update status');
            }
        });
    }
}
