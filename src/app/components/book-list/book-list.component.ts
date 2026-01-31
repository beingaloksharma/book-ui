import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { RouterModule, Router } from '@angular/router';

import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
    selector: 'app-book-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TruncatePipe],
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
    books: Book[] = [];
    loading = true;
    error = '';

    constructor(private bookService: BookService, private router: Router) { }

    ngOnInit(): void {
        this.loadBooks();
    }

    loadBooks(): void {
        this.bookService.getBooks().subscribe({
            next: (data) => {
                this.books = data;
                this.loading = false;
            },
            error: (err) => {
                if (err.status === 401) {
                    this.router.navigate(['/login']);
                    return;
                }
                this.error = 'Failed to load books. Please login.';
                this.loading = false;
                console.error(err);
            }
        });
    }
}
