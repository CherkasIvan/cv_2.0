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

    canActivate(): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
        if (!this._authService.isAuth$.value) {
            this._router.navigate([ERoute.AUTH]);
            return false;
        }
        return true;
    }
}
