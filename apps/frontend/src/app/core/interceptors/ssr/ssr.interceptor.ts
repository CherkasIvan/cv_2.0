import { of } from 'rxjs';

import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';

export const SsrInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    if (isPlatformServer(platformId)) {
        console.log(`[SSR] Skipping backend request: ${req.url}`);

        const isApiRequest = [
            '/auth',
            '/firebase',
            '/template',
            '/person',
            '/api/',
        ].some((pattern) => req.url.includes(pattern));

        if (isApiRequest) {
            return of(
                new HttpResponse({
                    body: { fallback: true, ssr: true },
                    status: 200,
                    headers: req.headers,
                }),
            );
        }
    }

    return next(req);
};
