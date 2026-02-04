import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { User, Address } from '../models/user.model';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [AuthService]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login and set token', () => {
        const credentials = { username: 'testuser', password: 'password' };

        service.login(credentials).subscribe(res => {
            expect(res.message.token).toBe('mock-jwt-token');
            expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
        });
    });

    it('should register a user', () => {
        const newUser: User = {
            id: '1', name: 'Test User', email: 'test@example.com', username: 'testuser',
            status: 'active', role: 'user', orders: [],
            created_at: '', updated_at: '',
            address: [{ street: '123 Main St', city: 'NY', state: 'NY', country: 'USA', zip_code: '10001' }]
        };

        service.register(newUser).subscribe(res => {
            expect(res.success).toBeTrue();
        });
    });
});
