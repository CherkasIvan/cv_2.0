import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { ERoute } from '@core/enum/route.enum';

import { TLocalstorageUser } from '@layout/store/model/localstorage-user.type';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    private isBrowser: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private readonly _router: Router,
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    private get localStorageAvailable(): boolean {
        return this.isBrowser && typeof localStorage !== 'undefined';
    }

    public getItem(key: string): string | null {
        if (this.localStorageAvailable) {
            return localStorage.getItem(key);
        }
        return null;
    }

    public checkLocalStorageUserName() {
        const userState = localStorage.getItem('usersState');
        if (userState) {
            const parsedUserState = JSON.parse(userState);
            if (parsedUserState.user && parsedUserState.user.email) {
                return parsedUserState.user.email.split('@')[0];
            }
        }
    }

    public setItem(key: string, value: string): void {
        if (this.localStorageAvailable) {
            localStorage.setItem(key, value);
        }
    }

    public removeItem(key: string): void {
        if (this.localStorageAvailable) {
            localStorage.removeItem(key);
        }
    }

    public getUsersState(): TLocalstorageUser | null {
        if (this.localStorageAvailable) {
            const getUser = localStorage.getItem('usersState');
            if (getUser) {
                return JSON.parse(getUser);
            }
        }
        return null;
    }

    public initUser(
        isFirstTime: boolean = false,
        isGuest: boolean = false,
        user: firebase.default.User | null,
        currentRoute: string | 'main',
    ): void {
        if (this.localStorageAvailable && !localStorage.getItem('usersState')) {
            const usersState: TLocalstorageUser = {
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
            localStorage.setItem('usersState', JSON.stringify(usersState));
        }
    }

    public setUser(userData: firebase.default.User | null): void {
        if (this.localStorageAvailable) {
            const usersState = this.getUsersState();
            if (usersState) {
                usersState.user = userData;
                localStorage.setItem('usersState', JSON.stringify(usersState));
            }
        }
    }

    public clearUserData(): void {
        if (this.localStorageAvailable) {
            const usersState = this.getUsersState();
            if (usersState) {
                usersState.user = null;
                localStorage.setItem('usersState', JSON.stringify(usersState));
            }
        }
    }

    public setNewUserState(newUsersState: TLocalstorageUser): void {
        if (this.localStorageAvailable) {
            localStorage.setItem('usersState', JSON.stringify(newUsersState));
        }
    }

    public updateCurrentRoute(route: string): void {
        if (this.localStorageAvailable) {
            const usersState = this.getUsersState();
            if (usersState) {
                usersState.currentRoute = route;
                localStorage.setItem('usersState', JSON.stringify(usersState));
            }
        }
    }

    public redirectToSavedRoute(): void {
        if (this.localStorageAvailable) {
            const usersState = this.getUsersState();
            if (usersState && (usersState.user || usersState.isGuest)) {
                const route = usersState.currentRoute || '/';
                this._router.navigate([route]);
            }
        }
    }

    public saveSelectedTab(selectedTab: 'work' | 'education'): void {
        if (this.localStorageAvailable) {
            const usersState = this.getUsersState();
            if (usersState && (usersState.user || usersState.isGuest)) {
                usersState.experienceRoute = selectedTab;
                localStorage.setItem('usersState', JSON.stringify(usersState));
            }
        }
    }

    public getSelectedTab(): 'work' | 'education' {
        if (this.localStorageAvailable) {
            const usersState = this.getUsersState();
            if (usersState && (usersState.user || usersState.isGuest)) {
                return usersState.experienceRoute || 'work';
            }
        }
        return 'work';
    }

    public saveSelectedTechnologiesTab(
        selectedTab: 'technologies' | 'other',
    ): void {
        if (this.localStorageAvailable) {
            const usersState = this.getUsersState();
            if (usersState && (usersState.user || usersState.isGuest)) {
                usersState.technologiesRoute = selectedTab;
                localStorage.setItem('usersState', JSON.stringify(usersState));
            }
        }
    }

    public getSelectedTechnologiesTab(): 'technologies' | 'other' {
        if (this.localStorageAvailable) {
            const usersState = this.getUsersState();
            if (usersState && (usersState.user || usersState.isGuest)) {
                return usersState.technologiesRoute || 'technologies';
            }
        }
        return 'technologies';
    }

    public saveSelectedSubTechnologiesTab(
        selectedTab: 'frontend' | 'backend',
    ): void {
        if (this.localStorageAvailable) {
            const usersState = this.getUsersState();
            if (usersState && (usersState.user || usersState.isGuest)) {
                usersState.subTechnologiesRoute = selectedTab;
                localStorage.setItem('usersState', JSON.stringify(usersState));
            }
        }
    }

    public getSelectedSubTechnologiesTab(): 'frontend' | 'backend' {
        if (this.localStorageAvailable) {
            const usersState = this.getUsersState();
            if (usersState && (usersState.user || usersState.isGuest)) {
                return usersState.subTechnologiesRoute || 'frontend';
            }
        }
        return 'frontend';
    }
}
