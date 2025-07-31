import { Observable, catchError, from, map, of, switchMap, tap } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { ERoute } from '@core/enum/route.enum';
import { TFirebaseUser } from '@core/models/firebase-user.type';

import { TCasheStorageUser } from '@layout/store/model/cash-storage-user.type';

const CACHE_VERSION = 'v1';
const USER_STATE_CACHE = `user-state-cache-${CACHE_VERSION}`;

@Injectable({
    providedIn: 'root',
})
export class CacheStorageService {
    private isBrowser: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private readonly _router: Router,
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    private verifyServiceWorker(): Observable<boolean> {
        if (!this.isBrowser) return of(false);

        return from(navigator.serviceWorker.getRegistration()).pipe(
            map((registration) => {
                if (!registration) {
                    console.warn('No service worker registration found');
                    return false;
                }
                if (!registration.active) {
                    console.warn('Service worker registered but not active');
                    return false;
                }
                return true;
            }),
            catchError((err) => {
                console.error('Service worker check failed:', err);
                return of(false);
            }),
        );
    }

    private sendMessageToServiceWorker(message: any): void {
        if (this.isBrowser && 'serviceWorker' in navigator) {
            console.log('Sending message to service worker:', message);
            navigator.serviceWorker
                .getRegistration()
                .then((registration) => {
                    if (registration) {
                        console.log('Found service worker registration');
                        if (registration.active) {
                            console.log(
                                'Posting message to active service worker',
                            );
                            registration.active.postMessage(message);
                        } else {
                            console.warn(
                                'Service worker registered but not active',
                            );
                        }
                    } else {
                        console.warn('No service worker registration found');
                    }
                })
                .catch((err) => console.error('Service worker error:', err));
        }
    }

    public setUsersState(state: TCasheStorageUser): Observable<void> {
        console.log(state.isFirstTime);
        return this.verifyServiceWorker().pipe(
            switchMap((isActive) => {
                if (!isActive) {
                    return this.setCachedData('userState', state);
                }
                return this.setCachedData('userState', state).pipe(
                    tap(() => {
                        this.sendMessageToServiceWorker({
                            action: 'updateUsersState',
                            state,
                        });
                    }),
                );
            }),
        );
    }

    private getCachedData(key: string): Observable<any> {
        if (!this.isBrowser) return of(null);

        return from(caches.open('user-state-cache')).pipe(
            switchMap((cache) => from(cache.match(key))),
            switchMap((response) =>
                response ? from(response.json()) : of(null),
            ),
        );
    }

    private setCachedData(key: string, data: any): Observable<void> {
        if (!this.isBrowser) return of(undefined);

        return from(caches.open('user-state-cache')).pipe(
            switchMap((cache) =>
                from(cache.put(key, new Response(JSON.stringify(data)))),
            ),
            map(() => undefined),
        );
    }

    public clearUserData(): Observable<void> {
        if (!this.isBrowser) return of(undefined);

        return from(caches.open('user-state-cache')).pipe(
            switchMap((cache) => from(cache.delete('userState'))),
            map(() => undefined),
        );
    }

    public getUsersState(): Observable<TCasheStorageUser | null> {
        return this.getCachedData('userState');
    }

    public getUserName(): Observable<string> {
        return this.getUsersState().pipe(
            map((state) => state?.user?.displayName || ''),
        );
    }

    public checkUserName(): Observable<string> {
        return this.getUsersState().pipe(
            map((state) => state?.user?.displayName || ''),
        );
    }

    public redirectToSavedRoute(): void {
        this.getUsersState().subscribe((usersState) => {
            if (usersState && (usersState.user || usersState.isGuest)) {
                const route = usersState.currentRoute || '/';
                this._router.navigate([route]);
            }
        });
    }

    public initUser(
        isFirstTime: boolean = false,
        isGuest: boolean = false,
        user: TFirebaseUser | null,
        currentRoute: string | 'main',
    ): Observable<void> {
        return this.getUsersState().pipe(
            switchMap((existingState) => {
                if (!existingState) {
                    const usersState: TCasheStorageUser = {
                        isFirstTime,
                        isGuest,
                        user,
                        currentRoute: `${ERoute.LAYOUT}/${currentRoute}`,
                        experienceRoute: 'work',
                        technologiesRoute: 'technologies',
                        subTechnologiesRoute: 'frontend',
                        isDark: false,
                        language: 'ru',
                    };
                    return this.setUsersState(usersState);
                }
                return of(undefined);
            }),
        );
    }

    public setUser(userData: TFirebaseUser | null): Observable<void> {
        return this.getUsersState().pipe(
            switchMap((usersState) => {
                if (usersState) {
                    usersState.user = userData;
                    return this.setUsersState(usersState);
                }
                return of(undefined);
            }),
        );
    }

    public updateCurrentRoute(route: string): Observable<void> {
        return this.getUsersState().pipe(
            switchMap((usersState) => {
                if (usersState) {
                    usersState.currentRoute = route;
                    return this.setUsersState(usersState);
                }
                return of(undefined);
            }),
        );
    }

    public saveSelectedTab(selectedTab: 'work' | 'education'): void {
        this.getUsersState().subscribe((usersState) => {
            if (usersState && (usersState.user || usersState.isGuest)) {
                usersState.experienceRoute = selectedTab;
                this.setUsersState(usersState);
            }
        });
    }

    public getSelectedTab(): Observable<'work' | 'education'> {
        return this.getUsersState().pipe(
            map((usersState) =>
                usersState && (usersState.user || usersState.isGuest)
                    ? usersState.experienceRoute || 'work'
                    : 'work',
            ),
        );
    }

    public saveSelectedTechnologiesTab(
        selectedTab: 'technologies' | 'other',
    ): void {
        this.getUsersState().subscribe((usersState) => {
            if (usersState && (usersState.user || usersState.isGuest)) {
                usersState.technologiesRoute = selectedTab;
                this.setUsersState(usersState);
            }
        });
    }

    public getSelectedTechnologiesTab(): Observable<'technologies' | 'other'> {
        return this.getUsersState().pipe(
            map((usersState) =>
                usersState && (usersState.user || usersState.isGuest)
                    ? usersState.technologiesRoute || 'technologies'
                    : 'technologies',
            ),
        );
    }

    public saveSelectedSubTechnologiesTab(
        selectedTab: 'frontend' | 'backend',
    ): void {
        this.getUsersState().subscribe((usersState) => {
            if (usersState && (usersState.user || usersState.isGuest)) {
                usersState.subTechnologiesRoute = selectedTab;
                this.setUsersState(usersState);
            }
        });
    }

    public getSelectedSubTechnologiesTab(): Observable<'frontend' | 'backend'> {
        return this.getUsersState().pipe(
            map((usersState) =>
                usersState && (usersState.user || usersState.isGuest)
                    ? usersState.subTechnologiesRoute || 'frontend'
                    : 'frontend',
            ),
        );
    }

    public setDarkMode(isDark: boolean): void {
        this.getUsersState().subscribe((usersState) => {
            if (usersState) {
                usersState.isDark = isDark;
                this.setUsersState(usersState);
            }
        });
    }

    public getDarkMode(): Observable<boolean> {
        return this.getUsersState().pipe(
            map((usersState) => (usersState ? usersState.isDark : false)),
        );
    }

    public setLanguage(language: 'ru' | 'en'): Observable<void> {
        return this.getUsersState().pipe(
            switchMap((usersState) => {
                if (usersState) {
                    usersState.language = language;
                    return this.setUsersState(usersState);
                }
                return of(undefined);
            }),
        );
    }

    public getLanguage(): Observable<'ru' | 'en'> {
        return this.getUsersState().pipe(
            map((state) => state?.language || 'ru'),
        );
    }

    public getIsFirstTime(): Observable<boolean> {
        return this.getUsersState().pipe(
            map((usersState) => (usersState ? usersState.isFirstTime : true)),
        );
    }

    public setIsFirstTime(isFirstTime: boolean): void {
        this.getUsersState().subscribe((usersState) => {
            if (usersState) {
                usersState.isFirstTime = isFirstTime;
                this.setUsersState(usersState);
            }
        });
    }
}
