import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { ERoute } from '@app/core/enum/route.enum';
import { ILocalStorage } from '@app/core/models/localstorage.interface';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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

    public getUsersState(): ILocalStorage | null {
        if (this.localStorageAvailable) {
            const getUser = localStorage.getItem('usersState');
            if (getUser) {
                return JSON.parse(getUser);
            }
        }
        return null;
    }

    public initUser(user: firebase.default.User | null): void {
        if (this.localStorageAvailable && !localStorage.getItem('usersState')) {
            const usersState: ILocalStorage = {
                previousUser: null,
                user: user,
                rout: `${ERoute.LAYOUT}`,
                isDarkMode: 'false',
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

    public setNewUserState(newUsersState: ILocalStorage): void {
        if (this.localStorageAvailable) {
            localStorage.setItem('usersState', JSON.stringify(newUsersState));
        }
    }
}
