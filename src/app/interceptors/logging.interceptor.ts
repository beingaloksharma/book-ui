import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LoggerService } from '../services/logger.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const logger = inject(LoggerService);
    const startTime = Date.now();

    // Log Request
    logger.addLog({
        timestamp: new Date(),
        type: 'Request',
        url: req.urlWithParams,
        method: req.method,
        data: req.body
    });

    return next(req).pipe(
        tap({
            next: (event) => {
                if (event instanceof HttpResponse) {
                    const duration = Date.now() - startTime;
                    logger.addLog({
                        timestamp: new Date(),
                        type: 'Response',
                        url: req.urlWithParams,
                        method: req.method,
                        status: event.status,
                        duration: duration,
                        data: event.body
                    });
                }
            },
            error: (error: HttpErrorResponse) => {
                const duration = Date.now() - startTime;
                logger.addLog({
                    timestamp: new Date(),
                    type: 'Error',
                    url: req.urlWithParams,
                    method: req.method,
                    status: error.status,
                    duration: duration,
                    data: error.message
                });
            }
        })
    );
};
