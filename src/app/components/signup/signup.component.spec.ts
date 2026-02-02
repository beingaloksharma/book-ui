import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
    let component: SignupComponent;
    let fixture: ComponentFixture<SignupComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const spy = jasmine.createSpyObj('AuthService', ['register']);

        await TestBed.configureTestingModule({
            imports: [SignupComponent, HttpClientTestingModule, RouterTestingModule, FormsModule],
            providers: [
                { provide: AuthService, useValue: spy }
            ]
        })
            .compileComponents();

        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call register on submit', () => {
        component.user.name = 'Test User';
        component.user.username = 'testuser';
        component.password = 'password';
        component.user.email = 'test@example.com';
        component.user.address = { city: 'City', state: 'State', country: 'Country', pincode: '12345' };

        authServiceSpy.register.and.returnValue(of({ message: 'Success' }));
        spyOn(window, 'alert'); // Suppress alert

        component.onSubmit();

        expect(authServiceSpy.register).toHaveBeenCalled();
    });

    it('should handle registration error', () => {
        authServiceSpy.register.and.returnValue(throwError({ error: { message: 'Failed' } }));

        component.onSubmit();

        expect(component.error).toBe('Failed');
        expect(component.loading).toBeFalse();
    });
});
