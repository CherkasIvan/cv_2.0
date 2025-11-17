import { Observable, of } from 'rxjs';

import { isPlatformServer } from '@angular/common';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable()
export class SSRFallbackInterceptor implements HttpInterceptor {
    constructor(@Inject(PLATFORM_ID) private platformId: any) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        if (isPlatformServer(this.platformId)) {
            const backendUrls = [
                'localhost:3000',
                '127.0.0.1:3000',
                'backend:3000',
            ];

            const isBackendRequest = backendUrls.some((url) =>
                req.url.includes(url),
            );

            if (isBackendRequest) {
                console.log(
                    'SSR: Blocking backend request during build:',
                    req.url,
                );

                if (req.method === 'GET') {
                    return of(
                        new HttpResponse({
                            body: null,
                            status: 200,
                            statusText: 'OK',
                        }),
                    );
                } else {
                    return of(
                        new HttpResponse({
                            body: { success: true },
                            status: 200,
                            statusText: 'OK',
                        }),
                    );
                }
            }
        }

        return next.handle(req);
    }
}
