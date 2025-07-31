import { Observable, map, take, tap } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { ERoute } from '@core/enum/route.enum';
import { AuthService } from '@core/service/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    private _authService = inject(AuthService);
    private _router = inject(Router);

    canActivate(): Observable<boolean | UrlTree> {
        return this._authService.authState$.pipe(
            take(1),
            map(({ isAuth, isGuest }) => {
                const allowed = isAuth || isGuest;
                return allowed
                    ? true
                    : this._router.createUrlTree([ERoute.AUTH]);
            }),
        );
    }
}
