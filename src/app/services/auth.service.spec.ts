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
        const dummyResponse = {
            message: { token: 'abc-123', role: 'user', status: 'active' },
            success_code: '200'
        };
        const credentials = { username: 'testuser', password: 'password' };
        const dummyUser: User = {
            id: '1', name: 'Test User', email: 'test@example.com', username: 'testuser',
            status: 'active', type: 'user', orders: [],
            created_at: '', updated_at: '',
            address: { city: 'NY', state: 'NY', country: 'USA', pincode: '10001' }
        };

        service.login(credentials).subscribe(res => {
            expect(localStorage.getItem('auth_token')).toBe('abc-123');
            expect(localStorage.getItem('user_role')).toBe('user');
        });

        const req = httpMock.expectOne('http://127.0.0.1:8080/login');
        expect(req.request.method).toBe('POST');
        req.flush(dummyResponse);

        // It also calls fetchUserProfile immediately
        const req2 = httpMock.expectOne('http://127.0.0.1:8080/user/profile');
        // Backend returns wrapped user in 'message' inside 'user_profile' for user role
        req2.flush({ message: { user_profile: dummyUser, orders: [] } });
    });

    it('should register a user', () => {
        const newUser: User = {
            id: '1', name: 'Test User', email: 'test@example.com', username: 'testuser',
            status: 'active', type: 'user', orders: [],
            created_at: '', updated_at: '',
            address: { city: 'NY', state: 'NY', country: 'USA', pincode: '10001' }
        };

        service.register(newUser).subscribe(res => {
            expect(res).toBeTruthy();
        });

        const req = httpMock.expectOne('http://127.0.0.1:8080/signup');
        expect(req.request.method).toBe('POST');
        req.flush({ message: 'User created' });
    });
});
