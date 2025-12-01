import { Injectable, Injector } from '@angular/core';
import { 
    HttpInterceptor, 
    HttpRequest, 
    HttpHandler, 
    HttpEvent, 
    HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from '@core/service/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    // Используем Injector вместо прямого инжектирования AuthService
    constructor(
        private injector: Injector,
        private router: Router
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                // Обрабатываем только ошибки API
                if (this.isApiRequest(req.url) && error.status === 401) {
                    // Получаем AuthService через инжектор, чтобы избежать циклической зависимости
                    const authService = this.injector.get(AuthService);
                    // Автоматический разлогин при 401 ошибке
                    authService.updateState({ user: null });
                    this.router.navigate(['/auth']);
                }
                return throwError(() => error);
            })
        );
    }

    private isApiRequest(url: string): boolean {
        // Определяем, является ли запрос API запросом
        const apiPatterns = [
            '/auth',
            '/firebase',
            '/template',
            '/person',
            '/api/'
        ];
        
        return apiPatterns.some(pattern => url.includes(pattern));
    }
}   