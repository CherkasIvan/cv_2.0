import firebase from 'firebase/compat/app';
import {
    Observable,
    catchError,
    from,
    map,
    of,
    shareReplay,
    switchMap,
    tap,
    throwError,
} from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import {
    DestroyRef,
    Injectable,
    PLATFORM_ID,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { TCasheStorageUser } from '@layout/store/model/cash-storage-user.type';
import { TProfile } from '@layout/store/model/profile.type';

import { CacheStorageService } from '../cache-storage/cache-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _afAuth = inject(AngularFireAuth);
    private _afs = inject(AngularFirestore);
    private _router = inject(Router);
    private _cacheStorage = inject(CacheStorageService);
    private _store = inject(Store);
    private _destroyRef = inject(DestroyRef);
    private _platformId = inject(PLATFORM_ID);

    public authState$: Observable<{ isAuth: boolean; isGuest: boolean }>;
    private _isBrowser = isPlatformBrowser(this._platformId);

    // Add these signal declarations
    public isAuthenticated = signal(false);
    public isGuest = signal(false);

    constructor() {
        this.authState$ = this._initAuthState();
    }

    private _initAuthState(): Observable<{
        isAuth: boolean;
        isGuest: boolean;
    }> {
        if (!this._isBrowser) {
            return of({ isAuth: false, isGuest: false });
        }

        return this._afAuth.authState.pipe(
            switchMap((user) => {
                const isAuth = !!user;
                if (isAuth) {
                    this.isAuthenticated.set(true);
                    this.isGuest.set(false);
                    return of({ isAuth: true, isGuest: false });
                }
                return this._cacheStorage.getUsersState().pipe(
                    map((state) => {
                        const isGuest = state?.isGuest ?? false;
                        this.isAuthenticated.set(isGuest);
                        this.isGuest.set(isGuest);
                        return {
                            isAuth: isGuest,
                            isGuest: isGuest,
                        };
                    }),
                );
            }),
            takeUntilDestroyed(this._destroyRef),
            shareReplay(1),
        );
    }

    signIn(
        email: string,
        password: string,
    ): Observable<firebase.auth.UserCredential> {
        return from(
            this._afAuth.signInWithEmailAndPassword(email, password),
        ).pipe(
            switchMap((result) => {
                if (!this._isBrowser || !result.user) {
                    return throwError(() => new Error('Authentication failed'));
                }

                const user = this._convertToUserType(result.user);
                return this._cacheStorage.getUsersState().pipe(
                    switchMap((state) => {
                        const update$ = !state
                            ? this._cacheStorage.initUser(
                                  true,
                                  false,
                                  user,
                                  'main',
                              )
                            : this._cacheStorage.setUser(user);

                        return update$.pipe(
                            tap(() => {
                                this._setUserData(user);
                                this.isAuthenticated.set(true);
                                this.isGuest.set(false);
                                this._router.navigate([ERoute.LAYOUT]);
                            }),
                            map(() => result),
                        );
                    }),
                );
            }),
            catchError((error) => {
                this.isAuthenticated.set(false);
                this.isGuest.set(false);
                return throwError(() => error);
            }),
        );
    }

    signInAsGuest(): Observable<{ isAuth: boolean; isGuest: boolean }> {
        return from(this._afAuth.signInAnonymously()).pipe(
            switchMap((result) => {
                if (!result.user) {
                    return throwError(() => new Error('Guest auth failed'));
                }

                const guestState: TCasheStorageUser = {
                    isFirstTime: false,
                    isGuest: true, // Убедитесь, что isGuest: true
                    user: null,
                    route: `${ERoute.LAYOUT}/main`,
                    experienceRoute: 'work',
                    technologiesRoute: 'technologies',
                    subTechnologiesRoute: 'frontend',
                    isDark: false,
                    language: 'ru',
                };

                return this._cacheStorage.setUsersState(guestState).pipe(
                    switchMap(() => {
                        // Возвращаем явно гостевой статус
                        return of({
                            isAuth: true,
                            isGuest: true,
                        }).pipe(
                            tap((authState) => {
                                this.isAuthenticated.set(authState.isAuth);
                                this.isGuest.set(authState.isGuest);
                                console.log('Guest auth state:', authState);
                                this._router.navigate([ERoute.LAYOUT]);
                            }),
                        );
                    }),
                );
            }),
            catchError((error) => {
                this.isAuthenticated.set(false);
                this.isGuest.set(false);
                return throwError(() => error);
            }),
        );
    }

    signOut(): Observable<void> {
        return from(this._afAuth.signOut()).pipe(
            switchMap(() => this._cacheStorage.getUsersState()),
            switchMap((state) => {
                const update$ = state
                    ? this._cacheStorage.setUsersState({
                          ...state,
                          isGuest: false,
                          user: null,
                      })
                    : of(undefined);

                return update$.pipe(
                    switchMap(() => this._cacheStorage.clearUserData()),
                );
            }),
            tap(() => {
                this.isAuthenticated.set(false);
                this.isGuest.set(false);
                this._store.dispatch(AuthActions.getLogout());
                this._router.navigate([ERoute.AUTH]);
            }),
        );
    }

    private _setUserData(user: TFirebaseUser): Observable<void> {
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

    private _convertToUserType(user: any): TFirebaseUser {
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            providerData: (user.providerData || [])
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
}
