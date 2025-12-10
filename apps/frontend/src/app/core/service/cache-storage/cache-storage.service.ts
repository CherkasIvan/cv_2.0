import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
    Inject,
    Injectable,
    PLATFORM_ID,
    computed,
    inject,
    signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable, catchError, of, switchMap, tap } from 'rxjs';

import { TAuthResponse } from '@core/models/auth-response.type';
import { ERoute } from '@cv_2.0/shared/enum/route.enum';
import { TCasheStorageUserState } from '@layout/store/model/cash-storage-user-state.type';

@Injectable({
    providedIn: 'root',
})
export class CacheStorageService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private isBrowser: boolean;

    // 🎯 State signal (только в памяти)
    private userState = signal<TCasheStorageUserState | null>(null);

    // 🎯 Computed signals
    readonly state = computed(() => this.userState());
    readonly user = computed(() => this.userState()?.user ?? null);
    readonly isGuest = computed(() => this.userState()?.isGuest ?? false);
    readonly isFirstTime = computed(
        () => this.userState()?.isFirstTime ?? true,
    );
    readonly route = computed(
        () => this.userState()?.route ?? `${ERoute.LAYOUT}/main`,
    );
    readonly experiencERoute = computed(
        () => this.userState()?.experiencERoute ?? 'work',
    );
    readonly technologiesRoute = computed(
        () => this.userState()?.technologiesRoute ?? 'technologies',
    );
    readonly subTechnologiesRoute = computed(
        () => this.userState()?.subTechnologiesRoute ?? 'frontend',
    );
    readonly isDark = computed(() => this.userState()?.isDark ?? false);
    readonly language = computed(() => this.userState()?.language ?? 'ru');
    readonly userName = computed(
        () => this.userState()?.user?.displayName ?? '',
    );

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        this.initializeUserState();
    }

    private initializeUserState(): void {
        // Всегда создаем дефолтное состояние
        const defaultState: TCasheStorageUserState = {
            isFirstTime: true,
            isGuest: true,
            user: null,
            route: '/auth',
            experiencERoute: 'work',
            technologiesRoute: 'technologies',
            subTechnologiesRoute: 'frontend',
            isDark: false,
            language: 'ru',
        };

        this.userState.set(defaultState);

        // Потом пытаемся загрузить из бэкенда только в браузере
        if (this.isBrowser) {
            this.getUsersState().subscribe((state) => {
                if (state) {
                    this.userState.set(state);
                }
            });
        }
    }

    // 🎯 Main state management
    setUsersState(state: TCasheStorageUserState): Observable<void> {
        this.userState.set(state);

        // В SSR просто возвращаем успех, в браузере синхронизируем с бэкендом
        if (!this.isBrowser) {
            return of(void 0);
        }

        return this.http.post<void>('/person/state', state).pipe(
            tap(() => console.log('User state synced with backend')),
            catchError((error) => {
                console.error('Backend sync failed:', error);
                throw error;
            }),
        );
    }

    clearUserData(): Observable<void> {
        this.userState.set(null);

        if (!this.isBrowser) {
            return of(void 0);
        }

        return this.http.post<void>('/person/clear-state', {}).pipe(
            catchError((error) => {
                console.error('Failed to clear backend state:', error);
                throw error;
            }),
        );
    }

    getUsersState(): Observable<TCasheStorageUserState | null> {
        // В SSR возвращаем null, в браузере загружаем из бэкенда
        if (!this.isBrowser) {
            return of(null);
        }

        return this.http.get<TCasheStorageUserState>('/person/state').pipe(
            catchError((error) => {
                console.error('Failed to load user state from backend:', error);
                return of(null);
            }),
        );
    }

    // 🎯 User management
    setUser(userData: TAuthResponse | null): Observable<void> {
        return this.getUsersState().pipe(
            switchMap((usersState) => {
                const newState: TCasheStorageUserState = usersState
                    ? {
                          ...usersState,
                          user: userData
                              ? this.mapAuthResponseToUser(userData)
                              : null,
                          isGuest: !userData,
                      }
                    : {
                          isFirstTime: false,
                          isGuest: !userData,
                          user: userData
                              ? this.mapAuthResponseToUser(userData)
                              : null,
                          route: `${ERoute.LAYOUT}/main`,
                          experiencERoute: 'work',
                          technologiesRoute: 'technologies',
                          subTechnologiesRoute: 'frontend',
                          isDark: false,
                          language: 'ru',
                      };

                console.log('Setting user data:', newState);
                return this.setUsersState(newState);
            }),
        );
    }

    private mapAuthResponseToUser(authResponse: TAuthResponse): any {
        return {
            uid: authResponse.id.toString(),
            email: authResponse.loginEmail,
            displayName: authResponse.name,
            photoURL: authResponse.avatar,
            emailVerified: true,
            roles: authResponse.roles,
            emails: authResponse.emails,
            positions: authResponse.positions,
        };
    }

    initUser(
        isFirstTime: boolean = false,
        isGuest: boolean = false,
        user: TAuthResponse | null,
        route: string = 'main',
    ): Observable<void> {
        const usersState: TCasheStorageUserState = {
            isFirstTime,
            isGuest,
            user: user ? this.mapAuthResponseToUser(user) : null,
            route: `${ERoute.LAYOUT}/${route}`,
            experiencERoute: 'work',
            technologiesRoute: 'technologies',
            subTechnologiesRoute: 'frontend',
            isDark: false,
            language: 'ru',
        };

        console.log('Initializing user state:', usersState);
        return this.setUsersState(usersState);
    }

    // 🎯 Route management
    updatERoute(route: string): Observable<void> {
        return this.getUsersState().pipe(
            switchMap((usersState) => {
                if (usersState) {
                    usersState.route = route;
                    return this.setUsersState(usersState);
                }
                throw new Error('No user state found');
            }),
        );
    }

    redirectToSavedRoute(): void {
        this.getUsersState().subscribe((usersState) => {
            if (usersState && (usersState.user || usersState.isGuest)) {
                const route = usersState.route || '/';
                this.router.navigate([route]);
            }
        });
    }

    // 🎯 Experience tabs
    setSelectedExperienceTab(
        selectedTab: 'work' | 'education',
    ): Observable<void> {
        return this.getUsersState().pipe(
            switchMap((usersState) => {
                console.log(usersState);
                if (usersState) {
                    usersState.experiencERoute = selectedTab;
                    return this.setUsersState(usersState);
                }
                throw new Error('No user state found');
            }),
        );
    }

    getSelectedExperienceTab(): Observable<'work' | 'education'> {
        const currentTab = this.state()?.experiencERoute ?? 'work';
        return of(currentTab);
    }

    // 🎯 Technology tabs
    setSelectedMainTechnologiesTab(
        selectedTab: 'technologies' | 'other',
    ): Observable<void> {
        return this.getUsersState().pipe(
            switchMap((usersState) => {
                if (usersState) {
                    usersState.technologiesRoute = selectedTab;
                    return this.setUsersState(usersState);
                }
                throw new Error('No user state found');
            }),
        );
    }

    getSelectedMainTechnologiesTab(): Observable<'technologies' | 'other'> {
        const currentTab = this.state()?.technologiesRoute ?? 'technologies';
        return of(currentTab);
    }

    setSelectedSubTechnologiesTab(
        selectedTab: 'frontend' | 'backend',
    ): Observable<void> {
        return this.getUsersState().pipe(
            switchMap((usersState) => {
                if (usersState) {
                    usersState.subTechnologiesRoute = selectedTab;
                    return this.setUsersState(usersState);
                }
                throw new Error('No user state found');
            }),
        );
    }

    getSelectedSubTechnologiesTab(): Observable<'frontend' | 'backend'> {
        const currentTab = this.state()?.subTechnologiesRoute ?? 'frontend';
        return of(currentTab);
    }

    // 🎯 Theme management
    setDarkMode(isDark: boolean): Observable<void> {
        return this.getUsersState().pipe(
            switchMap((usersState) => {
                if (usersState) {
                    usersState.isDark = isDark;
                    return this.setUsersState(usersState);
                }
                throw new Error('No user state found');
            }),
        );
    }

    getDarkMode(): Observable<boolean> {
        const isDark = this.state()?.isDark ?? false;
        return of(isDark);
    }

    // 🎯 Language management
    setLanguage(language: 'ru' | 'en'): Observable<void> {
        return this.getUsersState().pipe(
            switchMap((usersState) => {
                if (usersState) {
                    usersState.language = language;
                    return this.setUsersState(usersState);
                }
                throw new Error('No user state found');
            }),
        );
    }

    getLanguage(): Observable<'ru' | 'en'> {
        const language = this.state()?.language ?? 'ru';
        return of(language);
    }

    // 🎯 Utility methods
    getIsFirstTime(): Observable<boolean> {
        const isFirstTime = this.state()?.isFirstTime ?? true;
        return of(isFirstTime);
    }

    setIsFirstTime(isFirstTime: boolean): Observable<void> {
        return this.getUsersState().pipe(
            switchMap((usersState) => {
                if (usersState) {
                    usersState.isFirstTime = isFirstTime;
                    return this.setUsersState(usersState);
                }
                throw new Error('No user state found');
            }),
        );
    }

    // 🎯 SSR compatibility
    isGuestMode(): boolean {
        return this.isGuest();
    }
}
