// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@core/service/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);

    return next(req).pipe(
        catchError((error) => {
            // Только в браузере обрабатываем ошибки авторизации
            if (isBrowser) {
                const isApiRequest =  ['/auth', '/firebase', '/person', '/template', '/i18n', '/api']
                    .some(pattern => req.url.includes(pattern));
                
                if (isApiRequest && error.status === 401) {
                    authService.updateState({ user: null });
                    router.navigate(['/auth']);
                }
            }
            return throwError(() => error);
        })
    );
};