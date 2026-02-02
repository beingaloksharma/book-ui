import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminBookListComponent } from './components/admin/admin-book-list/admin-book-list.component';
import { BookFormComponent } from './components/admin/book-form/book-form.component';
import { UserOrdersComponent } from './components/user/user-orders/user-orders.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'books', component: BookListComponent },
    { path: 'book/:id', component: BookDetailComponent },
    { path: 'cart', component: CartComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'user/orders', component: UserOrdersComponent },

    // Admin Routes
    { path: 'admin/books', component: AdminBookListComponent },
    { path: 'admin/book/new', component: BookFormComponent },
    { path: 'admin/book/edit/:id', component: BookFormComponent },

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
