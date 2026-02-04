import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';

@Component({
    selector: 'app-book-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './book-form.component.html',
    styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
    book: Book = {
        id: '',
        title: '',
        author: '',
        description: '',
        price: 0,
        tags: [],
        language: [],
        page_count: 0,
        isbn: '',
        status: 'active'
    };

    isEditMode = false;
    loading = false;
    tagsInput = '';
    langInput = '';

    constructor(
        private bookService: BookService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.bookService.getAdminBook(id).subscribe(data => {
                this.book = data;
                this.tagsInput = data.tags ? data.tags.join(', ') : '';
                this.langInput = data.language ? data.language.join(', ') : '';
            });
        }
    }

    onSubmit() {
        this.loading = true;
        // Process tags & language
        this.book.tags = this.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        this.book.language = this.langInput.split(',').map(l => l.trim()).filter(l => l);

        // Ensure numbers
        this.book.price = Number(this.book.price);
        this.book.page_count = Number(this.book.page_count);

        if (this.isEditMode) {
            this.bookService.updateBook(this.book).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Book updated successfully'
                    }).then(() => {
                        this.router.navigate(['/admin/books']);
                    });
                },
                error: (err) => {
                    console.error(err);
                    this.loading = false;
                    Swal.fire('Error', 'Failed to update book', 'error');
                }
            });
        } else {
            this.bookService.createBook(this.book).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Book created successfully'
                    }).then(() => {
                        this.router.navigate(['/admin/books']);
                    });
                },
                error: (err) => {
                    console.error(err);
                    this.loading = false;
                    Swal.fire('Error', 'Failed to create book', 'error');
                }
            });
        }
    }
}
