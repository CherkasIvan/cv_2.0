import { Observable, catchError, finalize, tap, throwError } from 'rxjs';

import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
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
    constructor(private _store: Store<ISpinner>) {}

    intercept(
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
