import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const ApiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);
    
    // Пропускаем запросы к статическим файлам и i18n
    if (req.url.includes('.json') || 
        req.url.includes('assets/') ||
        req.url.startsWith('./browser/')) {
        return next(req);
    }

    // Пропускаем полные URL
    if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
        return next(req);
    }

    // Добавляем API префикс только для API запросов
    const apiPaths = ['/auth', '/firebase', '/template', '/person', '/i18n', '/api'];
    const isApiPath = apiPaths.some(path => req.url.startsWith(path));
    
    if (isApiPath) {
        // 🔧 В SSR и браузере используем относительные пути - Express прокси их перенаправит
        console.log(`🔧 API request: ${req.method} ${req.url}`);
        
        const modifiedReq = req.clone({
            headers: req.headers
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
        });
        
        return next(modifiedReq);
    }

    return next(req);
};