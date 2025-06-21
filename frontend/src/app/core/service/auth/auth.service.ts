import firebase from 'firebase/compat/app';
import {
    BehaviorSubject,
    Observable,
    Subject,
    catchError,
    from,
    map,
    of,
    switchMap,
    takeUntil,
    tap,
    throwError,
} from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { ERoute } from '@core/enum/route.enum';
import { TFirebaseUser } from '@core/models/firebase-user.type';

import { AuthActions } from '@layout/store/auth-store/auth.actions';
import { TProfile } from '@layout/store/model/profile.type';

import { CacheStorageService } from '../cache-storage/cache-storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    public userData: TFirebaseUser | null = null;
    public isAuth$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private _destroyed$: Subject<void> = new Subject();
    private _isBrowser: boolean;

    constructor(
        private readonly _afs: AngularFirestore,
        private readonly _afAuth: AngularFireAuth,
        private readonly _router: Router,
        private readonly _cacheStorageService: CacheStorageService,
        private readonly _store$: Store,
        @Inject(PLATFORM_ID) private platformId: object,
    ) {
        this._isBrowser = isPlatformBrowser(this.platformId);
        this.initAuthState();
    }

    private initAuthState(): void {
        if (this._isBrowser) {
            this._afAuth.authState
                .pipe(takeUntil(this._destroyed$))
                .subscribe((user) => {
                    const isAuthenticated = !!user;
                    this.isAuth$.next(isAuthenticated);

                    if (!isAuthenticated) {
                        this._cacheStorageService
                            .getUsersState()
                            .subscribe((state) => {
                                if (state?.isGuest) {
                                    this.isAuth$.next(true);
                                }
                            });
                    }
                });
        }
    }

    signIn(
        email: string,
        password: string,
    ): Observable<firebase.auth.UserCredential> {
        return from(
            this._afAuth.signInWithEmailAndPassword(email, password),
        ).pipe(
            switchMap((result: firebase.auth.UserCredential) => {
                if (this._isBrowser && result.user) {
                    const user = this.convertToUserType(result.user);
                    return this._cacheStorageService.getUsersState().pipe(
                        switchMap((state) => {
                            const initOrUpdate$ = !state
                                ? this._cacheStorageService.initUser(
                                      false,
                                      false,
                                      user,
                                      'main',
                                  )
                                : this._cacheStorageService.setUser(user);

                            return initOrUpdate$.pipe(
                                tap(() => {
                                    this.setUserData(user);
                                    this.isAuth$.next(true);
                                    this._router.navigate([ERoute.LAYOUT]);
                                }),
                                map(() => result),
                            );
                        }),
                    );
                }
                return throwError(() => new Error('Authentication failed'));
            }),
            catchError((error: Error) => {
                this.isAuth$.next(false);
                return throwError(() => error);
            }),
        );
    }

    signInAsGuest() {
        return from(this._afAuth.signInAnonymously()).pipe(
            tap((result) => {
                if (this._isBrowser && result.user) {
                    const user = this.convertToUserType(result.user);
                    this._cacheStorageService
                        .getUsersState()
                        .subscribe((state) => {
                            if (!state) {
                                this._cacheStorageService.initUser(
                                    false,
                                    true,
                                    null,
                                    'main',
                                );
                            } else {
                                const updatedState = {
                                    ...state,
                                    isGuest: true,
                                    user: null,
                                };
                                this._cacheStorageService.setUsersState(
                                    updatedState,
                                );
                            }
                            this.isAuth$.next(true);
                            this._router.navigate([ERoute.LAYOUT]);
                        });
                }
            }),
            catchError((error: Error) => {
                this.isAuth$.next(false);
                console.error('signInAsGuest error:', error);
                throw error;
            }),
        );
    }

    private convertToUserType(user: any): TFirebaseUser {
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            providerData: user.providerData
                .filter((p: any) => p !== null)
                .map((p: any) => ({
                    uid: p.uid,
                    displayName: p.displayName,
                    email: p.email,
                    photoURL: p.photoURL,
                    providerId: p.providerId,
                })),
        };
    }

    setUserData(user: TFirebaseUser | null) {
        if (!user) return of(undefined);

        const userRef: AngularFirestoreDocument<TProfile> = this._afs.doc(
            `users/${user.uid}`,
        );
        const userData: TProfile = {
            uid: user.uid,
            email: user.email || undefined,
            displayName: user.displayName || undefined,
            photoURL: user.photoURL || undefined,
            emailVerified: user.emailVerified,
        };
        return from(userRef.set(userData, { merge: true }));
    }

    signOut() {
        return from(this._afAuth.signOut()).pipe(
            tap(() => {
                if (this._isBrowser) {
                    this._cacheStorageService
                        .getUsersState()
                        .subscribe((state) => {
                            if (state) {
                                const updatedState = {
                                    ...state,
                                    isGuest: false,
                                    user: null,
                                };
                                this._cacheStorageService.setUsersState(
                                    updatedState,
                                );
                            }
                            this._cacheStorageService
                                .clearUserData()
                                .subscribe(() => {
                                    this._store$.dispatch(
                                        AuthActions.getLogout(),
                                    );
                                    this.isAuth$.next(false);
                                    this._router.navigate([ERoute.AUTH]);
                                });
                        });
                }
            }),
        );
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
