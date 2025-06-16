import { Observable, from, map } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { ERoute } from '@core/enum/route.enum';

import { TCasheStorageUser } from '@layout/store/model/cash-storage-user.type';

@Injectable({
    providedIn: 'root',
})
export class CacheStorageService {
    private isBrowser: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        @Inject(Router) private readonly _router: Router,
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    private get localStorageAvailable(): boolean {
        return this.isBrowser && typeof CacheStorage !== 'undefined';
    }

    private sendMessageToServiceWorker(message: any): void {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (registration) {
                    registration.active?.postMessage(message);
                }
            });
        }
    }

    private getCachedData(key: string): Observable<any> {
        return from(caches.open('user-state-cache')).pipe(
            map((cache) => cache.match(key)),
            map((response) => (response ? response.json() : null)),
        );
    }

    private setCachedData(key: string, data: any): Observable<void> {
        return from(caches.open('user-state-cache')).pipe(
            map((cache) => cache.put(key, new Response(JSON.stringify(data)))),
        );
    }

    public getUsersState(): Observable<any> {
        return this.getCachedData('userState');
    }

    public setUsersState(state: any): void {
        this.setCachedData('userState', state).subscribe(() => {
            this.sendMessageToServiceWorker({
                action: 'updateUsersState',
                state,
            });
        });
    }

    public getUserName(): Observable<string> {
        return this.getUsersState().pipe(
            map((state) => (state && state.user ? state.user.displayName : '')),
        );
    }

    public checkUserName(): Observable<string> {
        return this.getUsersState().pipe(
            map((state) => (state && state.user ? state.user.displayName : '')),
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
        user: firebase.default.User | null,
        currentRoute: string | 'main',
    ): void {
        this.getUsersState().subscribe((existingState) => {
            if (!existingState) {
                const usersState: TCasheStorageUser = {
                    isFirstTime: isFirstTime,
                    isGuest: isGuest,
                    user: user,
                    currentRoute: `${ERoute.LAYOUT}/${currentRoute}`,
                    experienceRoute: 'work',
                    technologiesRoute: 'technologies',
                    subTechnologiesRoute: 'frontend',
                    isDark: false,
                    language: 'ru',
                };
                this.setUsersState(usersState);
            }
        });
    }

    public setUser(userData: firebase.default.User | null): void {
        this.getUsersState().subscribe((usersState: any) => {
            if (usersState) {
                usersState.user = userData;
                this.setUsersState(usersState);
            }
        });
    }

    public updateCurrentRoute(route: string): void {
        this.getUsersState().subscribe((usersState: any) => {
            if (usersState) {
                usersState.currentRoute = route;
                this.setUsersState(usersState);
            }
        });
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

    public setLanguage(language: 'ru' | 'en'): void {
        this.getUsersState().subscribe((usersState) => {
            if (usersState) {
                usersState.language = language;
                this.setUsersState(usersState);
            }
        });
    }

    public getLanguage(): Observable<'ru' | 'en'> {
        return this.getUsersState().pipe(
            map((usersState) => (usersState ? usersState.language : 'ru')),
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
