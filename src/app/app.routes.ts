import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { BookListComponent } from './components/user/book-list/book-list.component';
import { BookDetailComponent } from './components/user/book-detail/book-detail.component';
import { CartComponent } from './components/user/cart/cart.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { AdminBookListComponent } from './components/admin/admin-book-list/admin-book-list.component';
import { BookFormComponent } from './components/admin/book-form/book-form.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { UserOrdersComponent } from './components/user/user-orders/user-orders.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'book/:id', component: BookDetailComponent },
    { path: 'cart', component: CartComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'user/orders', component: UserOrdersComponent },
    { path: 'user/booklist', component: BookListComponent },

    // Admin Routes
    { path: 'admin/books', component: AdminBookListComponent },
    { path: 'admin/users', component: AdminUsersComponent },
    { path: 'admin/orders', component: AdminOrdersComponent },
    { path: 'admin/book/new', component: BookFormComponent },
    { path: 'admin/book/edit/:id', component: BookFormComponent },

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
