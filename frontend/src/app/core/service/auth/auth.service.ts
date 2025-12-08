import { catchError, of, tap, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

import { TAuthResponse } from '@core/models/auth-response.type';
import { isPlatformServer } from '@angular/common';

interface AuthState {
    user: TAuthResponse | null;
    isLoading: boolean;
    error: string | null;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private http = inject(HttpClient);
    
    // 🎯 State signals (только в памяти)
    private state = signal<AuthState>({
        user: null,
        isLoading: false,
        error: null,
    });

    // 🎯 BehaviorSubject для Observable состояния
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    // 🎯 Public computed signals
    readonly user = computed(() => this.state().user);
    readonly isLoading = computed(() => this.state().isLoading);
    readonly error = computed(() => this.state().error);
    readonly isAuthenticated = computed(() => !!this.state().user);
    
    // 🎯 Observable для guards и других подписок
    readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    isServer: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isServer = isPlatformServer(this.platformId);
        
        // Проверяем авторизацию только в браузере
        if (!this.isServer) {
            this.checkAuthStatus();
        }

        return this._afAuth.authState.pipe(
            switchMap((user) => {
                const isAuth = !!user;
                if (isAuth) {
                    this.isAuthenticated.set(true);
                    this.isGuest.set(false);
                    return of({ isAuth: true, isGuest: false });
                }
                return this._cacheStorage.getUsersState().pipe(
                    map((state) => {
                        const isGuest = state?.isGuest ?? false;
                        this.isAuthenticated.set(isGuest);
                        this.isGuest.set(isGuest);
                        return {
                            isAuth: isGuest,
                            isGuest: isGuest,
                        };
                    }),
                );
            }),
            takeUntilDestroyed(this._destroyRef),
            shareReplay(1),
        );
    }

    // 🎯 Private state updaters
     updateState(updates: Partial<AuthState>) {
        this.state.update((current) => ({ ...current, ...updates }));
        // Обновляем BehaviorSubject при изменении состояния
        this.isAuthenticatedSubject.next(!!this.state().user);
    }

    private setLoading(loading: boolean) {
        this.updateState({ isLoading: loading, error: null });
    }

    private setError(error: string) {
        this.updateState({ error, isLoading: false });
    }

    // 🎯 Auth methods
    signIn(email: string, password: string) {
        this.setLoading(true);

        return this.http
            .post<TAuthResponse>('/auth/login', {
                loginEmail: email,
                password,
            })
            .pipe(
                tap((user) => {
                    this.updateState({ user, isLoading: false });
                }),
                catchError((error) => {
                    this.setError(error.message);
                    return of(null);
                }),
            );
    }

    register(userData: any) {
        this.setLoading(true);

        return this.http
            .post<TAuthResponse>('/auth/register', userData)
            .pipe(
                tap((user) => {
                    this.updateState({ user, isLoading: false });
                }),
                catchError((error) => {
                    this.setError(error.message);
                    return of(null);
                }),
            );
    }

    signOut() {
        this.setLoading(true);

        return this.http.post<void>('/auth/logout', {}).pipe(
            tap(() => {
                this.updateState({
                    user: null,
                    isLoading: false,
                });
            }),
            catchError((error) => {
                this.setError(error.message);
                this.updateState({ user: null });
                return of(void 0);
            }),
        );
    }

    signInAsGuest() {
        this.setLoading(true);

        return this.http
            .post<TAuthResponse>('/auth/guest-login', {})
            .pipe(
                tap((user) => {
                    this.updateState({ user, isLoading: false });
                }),
                catchError((error) => {
                    this.setError(error.message);
                    return of(null);
                }),
            );
    }

    // 🎯 Проверка авторизации
    checkAuthStatus() {
        return this.http
            .get<TAuthResponse>('/auth/profile')
            .pipe(
                tap((user) => {
                    this.updateState({ user });
                    console.log('Auth status check: User authenticated', user);
                }),
                catchError((error) => {
                    // Не авторизован - это нормально
                    console.log('Auth status check: User not authenticated');
                    this.updateState({ user: null });
                    return of(null);
                }),
            )
            .subscribe();
    }

    // 🎯 Refresh token
    refreshToken() {
        return this.http
            .post<TAuthResponse>('/auth/refresh', {})
            .pipe(
                tap((user) => {
                    this.updateState({ user });
                }),
                catchError((error) => {
                    console.error('Token refresh error:', error);
                    this.updateState({ user: null });
                    return of(null);
                }),
            );
    }

    // 🎯 Получить текущего пользователя
    getCurrentUser(): TAuthResponse | null {
        return this.user();
    }
}
