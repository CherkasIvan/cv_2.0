import { User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

import { ERoute } from '@core/enum/route.enum';
import { ILocalStorage } from '@core/models/localstorage.interface';
import { ISnackbar } from '@core/models/snackbar.interface';

import { TProfile } from '@layout/store/model/profile.type';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    public userData: User | null = null;
    public isAuth$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public usersState: ILocalStorage | null = null;
    private isBrowser: boolean;

    constructor(
        private readonly _afs: AngularFirestore,
        private readonly _afAuth: AngularFireAuth,
        private readonly _router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        if (this.isBrowser && localStorage.getItem('usersState')) {
            this.isAuth$.next(true);
        } else {
            this.isAuth$.next(false);
        }
        this.usersState = this.getUsersState();
    }

    signIn(email: string, password: string) {
        return this._afAuth
            .signInWithEmailAndPassword(email, password)
            .then((result) => {
                !this.usersState
                    ? this.initUser(result.user)
                    : this.setUser(result.user);

                this.setUserData(result.user);
                if (result.user) {
                    this.isAuth$.next(true);
                    this._afAuth.authState.subscribe((user) => {
                        if (user) {
                            const snackbarDataSuccess: ISnackbar = {
                                message: `You are logged in as ${result.user?.email}`,
                                isSuccess: true,
                            };
                            if (this.isAuth$.value) {
                                this._router.navigate([ERoute.LAYOUT]);
                            }
                        }
                    });
                }
            })
            .catch((error: Error) => {
                const snackbarDataError: ISnackbar = {
                    message: error.message,
                    isSuccess: false,
                };
                this.isAuth$.next(false);
                return;
            });
    }

    public setUser(userData: firebase.default.User | null): void {
        if (this.isBrowser) {
            this.usersState = this.getUsersState();
            if (this.usersState) {
                this.usersState.user = userData;
                localStorage.setItem(
                    'usersState',
                    JSON.stringify(this.usersState),
                );
            }
        }
    }

    public setRout(currentRoute: string): void {
        if (this.isBrowser && this.usersState) {
            this.usersState.rout = currentRoute;
            localStorage.setItem('usersState', JSON.stringify(this.usersState));
        }
    }

    public setMode(currentMode: string): void {
        if (this.isBrowser && this.usersState) {
            this.usersState.isDarkMode = currentMode;
            localStorage.setItem('usersState', JSON.stringify(this.usersState));
        }
    }

    public setNewUserState(newUsersState: ILocalStorage): void {
        if (this.isBrowser) {
            this.usersState = newUsersState;
            if (this.usersState) {
                localStorage.setItem(
                    'usersState',
                    JSON.stringify(newUsersState),
                );
            }
        }
    }

    public initUser(user: firebase.default.User | null): void {
        if (this.isBrowser && !localStorage.getItem('userState')) {
            this.usersState = {
                previousUser: null,
                user: user,
                rout: `${ERoute.LAYOUT}`,
                isDarkMode: 'false',
            };
        }
    }

    public getUsersState(): ILocalStorage | null {
        if (this.isBrowser) {
            const getUser = localStorage.getItem('usersState');
            if (getUser) {
                return JSON.parse(getUser);
            }
        }
        return this.usersState;
    }

    setUserData(user: firebase.default.User | null) {
        const userRef: AngularFirestoreDocument<TProfile> = this._afs.doc(
            `users/${user?.uid}`,
        );
        const userData: TProfile = {
            uid: user?.uid,
            email: user?.email,
            displayName: user?.displayName,
            photoURL: user?.photoURL,
            emailVerified: user?.emailVerified,
        };
        return userRef.set(userData, {
            merge: true,
        });
    }
}
