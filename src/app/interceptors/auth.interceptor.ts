import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    if (req.url.endsWith('/login') || req.url.endsWith('/signup')) {
        return next(req);
    }

    const token = localStorage.getItem('auth_token');
    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloned);
    }

    return next(req);
};
