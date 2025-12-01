import { Observable, catchError, finalize, of, tap, throwError } from 'rxjs';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TSpinnerState } from '@layout/store/model/spinner-state.type';
import { hideSpinner } from '@layout/store/spinner-store/spinner.actions';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    private cache = new Map<string, HttpResponse<unknown>>();

    constructor(private _store: Store<TSpinnerState>) {}

    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        // Пропускаем запросы к API из кэширования и спиннера
        if (this.isApiRequest(req.url)) {
            return next.handle(req);
        }

        if (req.method !== 'GET') {
            return this.handleRequest(req, next);
        }

        const cachedResponse = this.cache.get(req.urlWithParams);
        if (cachedResponse) {
            return of(cachedResponse);
        }

        return this.handleRequest(req, next).pipe(
            tap((event) => {
                if (event instanceof HttpResponse) {
                    this.cache.set(req.urlWithParams, event);
                }
            }),
        );
    }

    private handleRequest(
        req: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        return next.handle(req).pipe(
            catchError((error) => {
                console.error('An error occurred:', error);
                return throwError(error);
            }),
            finalize(() => {
                this._store.dispatch(hideSpinner());
            }),
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