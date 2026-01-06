// loading.interceptor.ts
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';

import { finalize } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import {
    hideSpinner,
    showSpinner,
} from '@layout/store/spinner-store/spinner.actions';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
    const store = inject(Store);
    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);

    // Только в браузере показываем спиннер для API запросов
    if (isBrowser) {
        const isApiRequest = [
            '/auth',
            '/firebase',
            '/person',
            '/template',
            '/i18n',
            '/api',
        ].some((pattern) => req.url.includes(pattern));

        if (!isApiRequest) {
            store.dispatch(showSpinner());

            return next(req).pipe(
                finalize(() => {
                    store.dispatch(hideSpinner());
                }),
            );
        }
    }

    return next(req);
};
