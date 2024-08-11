import { User } from 'firebase/auth';
import { BehaviorSubject, catchError, from, tap } from 'rxjs';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

import { ERoute } from '@app/core/enum/route.enum';
import { TProfile } from '@app/layout/store/model/profile.type';

import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public userData: User | null = null;
    public isAuth$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public userState = this._localStorageService.getUsersState();

    constructor(
        private readonly _afs: AngularFirestore,
        private readonly _afAuth: AngularFireAuth,
        private readonly _router: Router,
        private readonly _localStorageService: LocalStorageService,
    ) {
        if (localStorage.getItem('usersState')) {
            this.isAuth$.next(true);
        } else {
            this.isAuth$.next(true);
        }
    }

    signIn(email: string, password: string) {
        return from(
            this._afAuth.signInWithEmailAndPassword(email, password),
        ).pipe(
            tap((result) => {
                !this.userState
                    ? this._localStorageService.initUser(result.user)
                    : this._localStorageService.setUser(result.user);

                this.setUserData(result.user);
                if (result.user) {
                    this.isAuth$.next(true);
                    this._afAuth.authState.subscribe((user) => {
                        if (user) {
                            if (this.isAuth$.value) {
                                this._router.navigate([ERoute.LAYOUT]);
                            }
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
                const removeUser = this._localStorageService.getUsersState();
                if (removeUser) {
                    const previousUser = removeUser.user;
                    removeUser.previousUser = previousUser;
                    removeUser.user = null;
                    if (removeUser.user === null) {
                        this._localStorageService.setNewUserState(removeUser);
                    }
                    this.isAuth$.next(false);
                    this._router.navigate([ERoute.AUTH]);
                }
            }),
        );
    }
}
