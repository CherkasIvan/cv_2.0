import {
    BehaviorSubject,
    Observable,
    catchError,
    map,
    of,
    shareReplay,
    switchMap,
    tap,
} from 'rxjs';

import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
    DestroyRef,
    Inject,
    Injectable,
    PLATFORM_ID,
    computed,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TAuthResponse } from '@core/models/auth-response.type';

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
    private destroyRef = inject(DestroyRef);
    private platformId = inject(PLATFORM_ID);

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
    readonly isServer: boolean;

    // 🎯 Auth state observable with automatic cleanup
    private authState$: Observable<{ isAuth: boolean; isGuest: boolean }>;

    constructor() {
        this.isServer = isPlatformServer(this.platformId);

        // Инициализация authState$ с автоматической отпиской
        this.authState$ = this.initializeAuthState().pipe(
            takeUntilDestroyed(this.destroyRef),
            shareReplay(1),
        );

        // Проверяем авторизацию только в браузере
        if (!this.isServer) {
            this.checkAuthStatus();
        }
    }

    // 🎯 Инициализация состояния авторизации
    private initializeAuthState(): Observable<{
        isAuth: boolean;
        isGuest: boolean;
    }> {
        // Если нужно работать с Firebase Auth, раскомментируйте и добавьте зависимости
        // return this._afAuth.authState.pipe(
        //     switchMap((user) => {
        //         const isAuth = !!user;
        //         if (isAuth) {
        //             return of({ isAuth: true, isGuest: false });
        //         }
        //         return this.getGuestState();
        //     })
        // );

        // Временная заглушка - всегда возвращаем гостя
        return of({ isAuth: false, isGuest: true });
    }

    // 🎯 Получение состояния гостя (если нужно)
    private getGuestState(): Observable<{ isAuth: boolean; isGuest: boolean }> {
        // Если нужно кэширование, раскомментируйте
        // return this._cacheStorage.getUsersState().pipe(
        //     map((state) => ({
        //         isAuth: state?.isGuest ?? false,
        //         isGuest: state?.isGuest ?? false,
        //     }))
        // );

        return of({ isAuth: false, isGuest: true });
    }

    // 🎯 Получить observable состояния авторизации
    getAuthState(): Observable<{ isAuth: boolean; isGuest: boolean }> {
        return this.authState$;
    }

    // 🎯 Private state updaters
    private updateState(updates: Partial<AuthState>): void {
        this.state.update((current) => ({ ...current, ...updates }));
        // Обновляем BehaviorSubject при изменении состояния
        this.isAuthenticatedSubject.next(!!this.state().user);
    }

    private setLoading(loading: boolean): void {
        this.updateState({ isLoading: loading, error: null });
    }

    private setError(error: string): void {
        this.updateState({ error, isLoading: false });
    }

    // 🎯 Auth methods
    signIn(email: string, password: string): Observable<TAuthResponse | null> {
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
                    this.setError(error.message || 'Ошибка входа');
                    return of(null);
                }),
            );
    }

    register(userData: any): Observable<TAuthResponse | null> {
        this.setLoading(true);

        return this.http.post<TAuthResponse>('/auth/register', userData).pipe(
            tap((user) => {
                this.updateState({ user, isLoading: false });
            }),
            catchError((error) => {
                this.setError(error.message || 'Ошибка регистрации');
                return of(null);
            }),
        );
    }

    signOut(): Observable<void | undefined> {
        this.setLoading(true);

        return this.http.post<void>('/auth/logout', {}).pipe(
            tap(() => {
                this.updateState({
                    user: null,
                    isLoading: false,
                });
            }),
            catchError((error) => {
                this.setError(error.message || 'Ошибка выхода');
                this.updateState({ user: null, isLoading: false });
                return of(void 0);
            }),
        );
    }

    signInAsGuest(): Observable<TAuthResponse | null> {
        this.setLoading(true);

        return this.http.post<TAuthResponse>('/auth/guest-login', {}).pipe(
            tap((user) => {
                this.updateState({ user, isLoading: false });
            }),
            catchError((error) => {
                this.setError(error.message || 'Ошибка входа как гость');
                return of(null);
            }),
        );
    }

    // 🎯 Проверка авторизации с автоматической отпиской
    checkAuthStatus(): void {
        this.http
            .get<TAuthResponse>('/auth/profile')
            .pipe(
                takeUntilDestroyed(this.destroyRef),
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
    refreshToken(): Observable<TAuthResponse | null> {
        return this.http.post<TAuthResponse>('/auth/refresh', {}).pipe(
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

    // 🎯 Очистка состояния (для тестов или явной очистки)
    clearState(): void {
        this.updateState({
            user: null,
            isLoading: false,
            error: null,
        });
    }
}
