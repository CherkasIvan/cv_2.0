import { Observable, map, take, tap } from 'rxjs';

import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { ERoute } from '@core/enum/route.enum';
import { AuthService } from '@core/service/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    constructor(
        private readonly _authService: AuthService,
        private _router: Router,
    ) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._authService.isAuth$.pipe(
            take(1),
            tap((isAuthenticated) => {
                if (!isAuthenticated) {
                    this._router.navigate([ERoute.AUTH]);
                }
            }),
            map(
                (isAuthenticated) =>
                    isAuthenticated ||
                    this._router.createUrlTree([ERoute.AUTH]),
            ),
        );
    }
}
