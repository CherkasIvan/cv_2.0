// src/app/core/interceptors/ssr/ssr.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const SsrInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);
    
    // Пропускаем запросы к внешним ресурсам и статическим файлам
    if (req.url.startsWith('http://') || 
        req.url.startsWith('https://') ||
        req.url.includes('.json') ||
        req.url.includes('assets/') ||
        req.url.includes('github.com')) {
        return next(req);
    }
    
    // В браузере добавляем полный URL к бэкенду
    if (isBrowser) {
        const apiPaths = ['/auth', '/firebase', '/person', '/template', '/i18n', '/api'];
        const isApiPath = apiPaths.some(path => req.url.startsWith(path));
        
        if (isApiPath) {
            const backendUrl = 'http://localhost:3000';
            let modifiedUrl: string;
            
            if (req.url.startsWith('/api')) {
                // Преобразуем /api/path -> /api/v1/path
                const apiPath = req.url.substring(4);
                modifiedUrl = `${backendUrl}/api/v1${apiPath}`;
            } else {
                modifiedUrl = `${backendUrl}${req.url}`;
            }
            
            console.log(`🌐 Browser API request: ${req.url} -> ${modifiedUrl}`);
            
            const modifiedReq = req.clone({
                url: modifiedUrl
            });
            
            return next(modifiedReq);
        }
    }
    
    return next(req);
};