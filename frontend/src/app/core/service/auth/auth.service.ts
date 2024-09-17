import { User } from 'firebase/auth';
import { BehaviorSubject, catchError, from, tap } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { ERoute } from '@core/enum/route.enum';

import { AuthActions } from '@layout/store/auth-store/auth.actions';
import { TProfile } from '@layout/store/model/profile.type';

import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public userData: User | null = null;
    public isAuth$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public usersState = this._localStorageService.getUsersState();

    private _isBrowser: boolean;

    constructor(
        private readonly _afs: AngularFirestore,
        private readonly _afAuth: AngularFireAuth,
        private readonly _router: Router,
        private readonly _localStorageService: LocalStorageService,
        private readonly _store$: Store,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this._isBrowser = isPlatformBrowser(this.platformId);
        if (this._isBrowser && localStorage.getItem('usersState')) {
            this.isAuth$.next(true);
        } else {
            this.isAuth$.next(false);
        }
    }

    signIn(email: string, password: string) {
        return from(
            this._afAuth.signInWithEmailAndPassword(email, password),
        ).pipe(
            tap((result) => {
                if (!this.usersState) {
                    this._localStorageService.initUser(
                        true,
                        false,
                        result.user,
                        'main',
                    );
                } else {
                    this._localStorageService.setUser(result.user);
                }

                this.setUserData(result.user);
                if (result.user) {
                    this.isAuth$.next(true);
                    this._afAuth.authState.subscribe((user) => {
                        if (user && this.isAuth$.value) {
                            this._router.navigate([ERoute.LAYOUT]);
                        }
                    });
                }
            }),
            catchError((error: Error) => {
                this.isAuth$.next(false);
                throw error;
            }),
        );
    }

    signInAsGuest() {
        return from(this._afAuth.signInAnonymously()).pipe(
            tap((result) => {
                if (!this.usersState) {
                    this._localStorageService.initUser(
                        true,
                        true,
                        null,
                        'main',
                    );
                } else {
                    this._localStorageService.setUser(null);
                }
                this.isAuth$.next(true);
                this._router.navigate([ERoute.LAYOUT]);
            }),
            catchError((error: Error) => {
                this.isAuth$.next(false);
                throw error;
            }),
        );
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
        return from(userRef.set(userData, { merge: true }));
    }

    signOut() {
        return from(this._afAuth.signOut()).pipe(
            tap(() => {
                this._localStorageService.clearUserData();
                this._store$.dispatch(AuthActions.getLogout());
                this.isAuth$.next(false);
                this._router.navigate([ERoute.AUTH]);
            }),
        );
    }
}
