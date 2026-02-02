import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, withInterceptors, provideHttpClient } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
    let httpMock: HttpTestingController;
    let http: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting()
            ]
        });

        httpMock = TestBed.inject(HttpTestingController);
        http = TestBed.inject(HttpClient);
        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should add Authorization header if token exists', () => {
        localStorage.setItem('auth_token', 'test-token');

        http.get('/api/user/profile').subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('/api/user/profile');
        expect(req.request.headers.has('Authorization')).toBeTrue();
        expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
        req.flush({});
    });

    it('should NOT add Authorization header if no token exists', () => {
        http.get('/api/user/profile').subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('/api/user/profile');
        expect(req.request.headers.has('Authorization')).toBeFalse();
        req.flush({});
    });

    it('should NOT add Authorization header for /login endpoint', () => {
        localStorage.setItem('auth_token', 'test-token');

        http.post('/api/login', {}).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('/api/login');
        expect(req.request.headers.has('Authorization')).toBeFalse();
        req.flush({});
    });

    it('should NOT add Authorization header for /signup endpoint', () => {
        localStorage.setItem('auth_token', 'test-token');

        http.post('/api/signup', {}).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('/api/signup');
        expect(req.request.headers.has('Authorization')).toBeFalse();
        req.flush({});
    });
});
