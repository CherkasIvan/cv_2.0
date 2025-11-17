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

import { ISpinner } from '@layout/store/model/spinner.interface';
import {
    hideSpinner,
    showSpinner,
} from '@layout/store/spinner-store/spinner.actions';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    private cache = new Map<string, HttpResponse<unknown>>();

    constructor(private _store: Store<ISpinner>) {}

    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
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
        this._store.dispatch(showSpinner());
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
}
