import { of } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ERoute } from '@core/enum/route.enum';
import { AuthService } from '@core/service/auth/auth.service';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
    let authGuard: AuthGuard;
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuth$']);
        const routerSpy = jasmine.createSpyObj('Router', [
            'navigate',
            'parseUrl',
        ]);

        TestBed.configureTestingModule({
            providers: [
                AuthGuard,
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        });

        authGuard = TestBed.inject(AuthGuard);
        authService = TestBed.inject(
            AuthService,
        ) as jasmine.SpyObj<AuthService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should be created', () => {
        expect(authGuard).toBeTruthy();
    });

    it('should return true if the user is authenticated', () => {
        authService.isAuth$.next(true);
        expect(authGuard.canActivate()).toBe(true);
    });

    it('should navigate to AUTH route if the user is not authenticated', () => {
        authService.isAuth$.next(false);
        router.parseUrl.and.returnValue(router.parseUrl(ERoute.AUTH));
        expect(authGuard.canActivate()).toEqual(router.parseUrl(ERoute.AUTH));
    });
});
