import { Observable, from, map, of, switchMap, tap } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { ERoute } from '@core/enum/route.enum';
import { TFirebaseUser } from '@core/models/firebase-user.type';

import { TCasheStorageUser } from '@layout/store/model/cash-storage-user.type';

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

    private sendMessageToServiceWorker(message: any): void {
        if (this.isBrowser && 'serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (registration) {
                    registration.active?.postMessage(message);
                }
            });
        }
    }

    public setUsersState(state: TCasheStorageUser): Observable<void> {
        return this.setCachedData('userState', state).pipe(
            tap(() => {
                this.sendMessageToServiceWorker({
                    action: 'updateUsersState',
                    state,
                });
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
