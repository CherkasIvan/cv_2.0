import { Injectable } from '@angular/core';
import { 
    HttpInterceptor, 
    HttpRequest, 
    HttpHandler, 
    HttpEvent,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '@env/environment';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Для отладки
        console.log('🔍 ApiPrefixInterceptor intercepting:', {
            url: req.url,
            method: req.method,
            isApiRequest: this.isApiRequest(req.url),
            needsPrefix: this.needsApiPrefix(req.url)
        });

        const modifiedReq = this.handleApiRequest(req);
        
        console.log('🔧 Modified request:', {
            originalUrl: req.url,
            modifiedUrl: modifiedReq.url,
            headers: modifiedReq.headers.keys()
        });
        
        return next.handle(modifiedReq).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    console.log('✅ API Response for:', modifiedReq.url, {
                        status: event.status,
                        body: event.body
                    });
                }
            })
        );
    }

    private handleApiRequest(req: HttpRequest<any>): HttpRequest<any> {
        // Если URL уже содержит http:// или https://, это уже полный URL
        if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
            console.log('⚠️ Full URL detected, skipping prefix:', req.url);
            return req;
        }

        // Проверяем, нужен ли префикс для этого запроса
        if (this.needsApiPrefix(req.url)) {
            return this.addApiHeaders(req);
        }
        
        return req;
    }

    private needsApiPrefix(url: string): boolean {
        // Определяем, нужен ли API префикс для этого URL
        const apiPaths = [
            '/auth',
            '/firebase',
            '/template',
            '/person',
            '/api/v1'
        ];

        if (url.startsWith('/api/v1')) {
            console.log('📡 Will be handled by proxy:', url);
            return true; // Все равно добавляем заголовки
        }

        // Если это API путь, но без префикса
        const needsPrefix = apiPaths.some(path => url.startsWith(path));
        
        console.log('🔗 URL analysis:', {
            url: url,
            startsWithApiV1: url.startsWith('/api/v1'),
            isApiPath: apiPaths.some(path => url.startsWith(path)),
            needsPrefix: needsPrefix && !url.startsWith('/api/v1')
        });
        
        return needsPrefix && !url.startsWith('/api/v1');
    }

    private addApiHeaders(req: HttpRequest<any>): HttpRequest<any> {
        // Для API запросов добавляем JSON заголовки
        const headers = req.headers
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        
        return req.clone({
            headers: headers
        });
    }

    private isApiRequest(url: string): boolean {
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