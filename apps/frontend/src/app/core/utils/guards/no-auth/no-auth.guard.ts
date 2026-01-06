// no-auth.guard.ts
import { Observable, map, of } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '@core/service/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    canActivate(): Observable<boolean> {
        // On server, allow navigation
        if (!this.isBrowser) {
            return of(true);
        }

        return this.authService.isAuthenticated$.pipe(
            map((isAuthenticated) => {
                if (!isAuthenticated) {
                    return true;
                } else {
                    // If already authenticated, redirect to layout
                    this.router.navigate(['/layout']);
                    return false;
                }
            }),
        );
    }
}
