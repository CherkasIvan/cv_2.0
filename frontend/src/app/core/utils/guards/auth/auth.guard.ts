// auth.guard.ts
import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { AuthService } from '@core/service/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        // On server, allow navigation (let client handle auth)
        if (!this.isBrowser) {
            return of(true);
        }

        // Don't check auth for auth routes
        if (state.url.startsWith('/auth')) {
            return of(true);
        }

        return this.authService.isAuthenticated$.pipe(
            map(isAuthenticated => {
                if (isAuthenticated) {
                    return true;
                } else {
                    // Redirect to auth page
                    this.router.navigate(['/auth'], {
                        queryParams: { returnUrl: state.url }
                    });
                    return false;
                }
            })
        );
    }
}