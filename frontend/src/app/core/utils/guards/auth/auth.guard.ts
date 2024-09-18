import { Observable } from 'rxjs';

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

    canActivate():
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        if (!this._authService.isAuth$.value) {
            return this._router.parseUrl(ERoute.AUTH);
        }
        return true;
    }
}
