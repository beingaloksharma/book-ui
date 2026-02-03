import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-book-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './book-detail.component.html',
    styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
    book: Book | null = null;
    loading = true;
    error = '';
    addingToCart = false;

    constructor(
        private route: ActivatedRoute,
        private bookService: BookService,
        private cartService: CartService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.bookService.getBook(id).subscribe({
                next: (data) => {
                    this.book = data;
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Failed to load book details';
                    this.loading = false;
                }
            });
        } else {
            this.error = 'Invalid Book ID';
            this.loading = false;
        }
    }

    addToCart() {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }

        if (!this.book) return;

        this.addingToCart = true;
        const item = {
            book_id: this.book.id,
            user_id: '', // Backend handles this from token/context
            quantity: 1,
            price: this.book.price
        };

        this.cartService.addToCart(item).subscribe({
            next: () => {
                this.addingToCart = false;
                alert('Book added to cart!');
            },
            error: (err) => {
                this.addingToCart = false;
                alert('Failed to add to cart');
                console.error(err);
            }
        });
    }
}
