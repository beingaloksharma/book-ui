import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('ForgotPasswordComponent', () => {
    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['forgotPassword']);

        await TestBed.configureTestingModule({
            imports: [ForgotPasswordComponent, RouterTestingModule, FormsModule],
            providers: [
                { provide: AuthService, useValue: authServiceSpy }
            ]
        }).compileComponents();

        // Inject router and spy on navigate
        const router = TestBed.inject(Router);
        routerSpy = spyOn(router, 'navigate') as unknown as jasmine.SpyObj<Router>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show error if email is empty', () => {
        component.email = '';
        component.onSubmit();
        expect(component.error).toBe('Please enter your email address');
    });

    it('should call authService.forgotPassword and show message on success', () => {
        component.email = 'test@example.com';
        authServiceSpy.forgotPassword.and.returnValue(of({ success: true }));

        component.onSubmit();

        expect(authServiceSpy.forgotPassword).toHaveBeenCalledWith('test@example.com');
        expect(component.message).toContain('reset link shortly');
        expect(component.error).toBe('');
    });

    it('should show error on failure', () => {
        component.email = 'fail@example.com';
        authServiceSpy.forgotPassword.and.returnValue(throwError(() => new Error('Network error')));

        component.onSubmit();

        expect(component.error).toContain('went wrong');
        expect(component.message).toBe('');
    });
});
