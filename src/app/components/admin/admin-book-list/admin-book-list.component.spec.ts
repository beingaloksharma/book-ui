import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminBookListComponent } from './admin-book-list.component';
import { BookService } from '../../../services/book.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Book } from '../../../models/book.model';

describe('AdminBookListComponent', () => {
    let component: AdminBookListComponent;
    let fixture: ComponentFixture<AdminBookListComponent>;
    let bookServiceSpy: jasmine.SpyObj<BookService>;

    beforeEach(async () => {
        const spy = jasmine.createSpyObj('BookService', ['getAdminBooks', 'deleteBook']);

        await TestBed.configureTestingModule({
            imports: [AdminBookListComponent, RouterTestingModule],
            providers: [
                { provide: BookService, useValue: spy }
            ]
        }).compileComponents();

        bookServiceSpy = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    });

    it('should create and load books', () => {
        const dummyBooks: Book[] = [
            { id: '1', title: 'B1', author: 'A1', price: 10, stock: 5, page_count: 100, status: 'active', tags: [], language: [], description: 'desc', isbn: '111' }

        ];
        bookServiceSpy.getAdminBooks.and.returnValue(of(dummyBooks));

        fixture = TestBed.createComponent(AdminBookListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(component.books.length).toBe(1);
        expect(component.books).toEqual(dummyBooks);
    });

    it('should delete a book', () => {
        bookServiceSpy.getAdminBooks.and.returnValue(of([]));
        bookServiceSpy.deleteBook.and.returnValue(of({}));

        spyOn(window, 'confirm').and.returnValue(true);

        fixture = TestBed.createComponent(AdminBookListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.books = [{ id: '1', title: 'B1', author: 'A1', price: 10, stock: 5, page_count: 100, status: 'active', tags: [], language: [], description: 'desc', isbn: '111' }];
        component.deleteBook('1');

        expect(bookServiceSpy.deleteBook).toHaveBeenCalledWith('1');
        expect(component.books.length).toBe(0);
    });
});
