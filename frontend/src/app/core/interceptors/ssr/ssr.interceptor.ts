import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class SsrInterceptor implements HttpInterceptor {
    constructor(@Inject(PLATFORM_ID) private platformId: any) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // На сервере пропускаем запросы к бэкенду
        if (isPlatformServer(this.platformId)) {
            console.log(`[SSR] Skipping backend request: ${req.url}`);
            
            if (this.isApiRequest(req.url)) {
                return this.handleSsrRequest(req);
            }
        }
        
        return next.handle(req);
    }

    private handleSsrRequest(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        // Возвращаем заглушки для API запросов на сервере
        const url = req.url;
        
        if (url.includes('/auth')) {
            return of(new HttpResponse({
                body: { user: null, token: null, fallback: true },
                status: 200,
                statusText: 'OK',
                headers: req.headers
            }));
        }
        
        if (url.includes('/template/navigation')) {
            return of(new HttpResponse({
                body: [
                    {
                        id: 'main-fallback',
                        link: '/main',
                        position: 1,
                        value: 'Main',
                        imgName: 'home'
                    },
                    {
                        id: 'about-fallback',
                        link: '/about',
                        position: 2,
                        value: 'About',
                        imgName: 'info'
                    }
                ],
                status: 200,
                statusText: 'OK',
                headers: req.headers
            }));
        }
        
        if (url.includes('/template/main-page-info')) {
            return of(new HttpResponse({
                body: [{
                    id: 'main-page-fallback',
                    buttonHoverText: 'View portfolio',
                    buttonText: 'Explore',
                    description: 'Developer Portfolio',
                    name: 'Portfolio',
                    imgSrc: '',
                    stack: 'Full Stack Developer',
                    status: 'Available for work',
                    imgName: 'avatar'
                }],
                status: 200,
                statusText: 'OK',
                headers: req.headers
            }));
        }
        
        // Общая заглушка для остальных API
        return of(new HttpResponse({
            body: [],
            status: 200,
            statusText: 'OK',
            headers: req.headers
        }));
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