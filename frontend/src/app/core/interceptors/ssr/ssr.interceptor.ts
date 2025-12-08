import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

export const SsrInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);
    
    if (isPlatformServer(platformId)) {
        console.log(`[SSR] Skipping backend request: ${req.url}`);
        
        const isApiRequest = ['/auth', '/firebase', '/template', '/person', '/api/']
            .some(pattern => req.url.includes(pattern));
        
        if (isApiRequest) {
            return of(new HttpResponse({
                body: { fallback: true, ssr: true },
                status: 200,
                headers: req.headers
            }));
        }
    }
    
    return next(req);
};