import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn', 'isAdmin']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [LoginComponent, HttpClientTestingModule, FormsModule],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();
    });

    function createComponent() {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    it('should create', () => {
        authServiceSpy.isLoggedIn.and.returnValue(false);
        createComponent();
        expect(component).toBeTruthy();
    });

    it('should redirect to admin books if already logged in as admin', () => {
        authServiceSpy.isLoggedIn.and.returnValue(true);
        authServiceSpy.isAdmin.and.returnValue(true);
        createComponent();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/books']);
    });

    it('should redirect to books if already logged in as user', () => {
        authServiceSpy.isLoggedIn.and.returnValue(true);
        authServiceSpy.isAdmin.and.returnValue(false);
        createComponent();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/user/books']);
    });

    it('should redirect to admin books on successful login as admin', () => {
        authServiceSpy.isLoggedIn.and.returnValue(false);
        authServiceSpy.login.and.returnValue(of({ success: true }));
        authServiceSpy.isAdmin.and.returnValue(true);
        createComponent();

        component.username = 'admin';
        component.password = 'password';
        component.onSubmit();

        expect(authServiceSpy.login).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/books']);
    });

    it('should redirect to books on successful login as user', () => {
        authServiceSpy.isLoggedIn.and.returnValue(false);
        authServiceSpy.login.and.returnValue(of({ success: true }));
        authServiceSpy.isAdmin.and.returnValue(false);
        createComponent();

        component.username = 'user';
        component.password = 'password';
        component.onSubmit();

        expect(authServiceSpy.login).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/user/books']);
    });
});
