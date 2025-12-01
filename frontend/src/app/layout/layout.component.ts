import { Observable, takeUntil, timer } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { RouterOutlet } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { TEducationExperience } from '@core/models/education-experience.type';
import { TNavigation } from '@core/models/navigation.type';
import { TSocialMedia } from '@core/models/social-media.type';
import { TWorkExperience } from '@core/models/work-experience.type';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { DestroyService } from '@core/service/destroy/destroy.service';

import { ROUTER_CLASSES } from '@assets/animations/css.ts/router-animations.css';
import { START_CARD_CLASSES } from '@assets/animations/css.ts/start-card-animations.css';

import { TranslateModule } from '@ngx-translate/core';

import { AnimationBgComponent } from './components/animation-bg/animation-bg.component';
import { DarkAnimationLayoutComponent } from './components/dark-animation-layout/dark-animation-layout.component';
import { ExperienceDialogComponent } from './components/experience-dialog/experience-dialog.component';
import { FirstTimeComponent } from './components/first-time/first-time.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoutDialogComponent } from './components/logout-form/logout-dialog.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { darkModeSelector } from './store/dark-mode-store/dark-mode.selectors';
import {
    selectIsModalOpen,
    selectModalData,
} from './store/experience-dialog-store/experience-dialog.selectors';
import * as FirebaseActions from './store/firebase-store/firebase.actions';
import {
    selectNavigation,
    selectSocialMediaLinks,
} from './store/firebase-store/firebase.selectors';

@Component({
    selector: 'cv-layout',
    standalone: true,
    imports: [
        FooterComponent,
        HeaderComponent,
        RouterOutlet,
        AnimationBgComponent,
        AsyncPipe,
        SpinnerComponent,
        LogoutDialogComponent,
        DarkAnimationLayoutComponent,
        ExperienceDialogComponent,
        FirstTimeComponent,
        TranslateModule,
        NgClass,
        LogoutDialogComponent,
    ],
    templateUrl: './layout.component.html',
    styleUrls: [
        './layout.component.scss',
        './layout-dm/layout-dm.component.scss',
        './layout-media/layout-media.component.scss',
    ],
    providers: [DestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
    private _destroyed$ = inject(DestroyService);
    private _cdr = inject(ChangeDetectorRef);
    private _store$ = inject(Store);
    private _cacheStorageService = inject(CacheStorageService);
    private _afAuth = inject(AngularFireAuth);
    private _isFirstTimeSignal$ = computed(() =>
        this._cacheStorageService.isFirstTime(),
    );

    public isFirstTime$ = toObservable(this._isFirstTimeSignal$);

    public readonly routeClasses = ROUTER_CLASSES;
    public readonly startCardClasses = START_CARD_CLASSES;

    public isModalDialogVisible = signal<boolean>(false);
    public isAuth: boolean = false;
    public modalData$!: Observable<
        TWorkExperience | TEducationExperience | null
    >;

    public isExperienceDialogVisible$ = this._store$.pipe(
        takeUntil(this._destroyed$),
        select(selectIsModalOpen),
    );

    public currentTheme$: Observable<boolean> = this._store$.pipe(
        takeUntil(this._destroyed$),
        select(darkModeSelector),
    );

    public navigation$: Observable<TNavigation[]> = this._store$.pipe(
        takeUntil(this._destroyed$),
        select(selectNavigation),
    );

    public social$: Observable<TSocialMedia[]> = this._store$.pipe(
        takeUntil(this._destroyed$),
        select(selectSocialMediaLinks),
    );

    constructor() {
        this._store$.dispatch(FirebaseActions.loadNavigation());
        this._store$.dispatch(FirebaseActions.loadSocialMedia());

        this.isFirstTime$.pipe(takeUntilDestroyed()).subscribe((firstTime) => {
            if (firstTime) {
                timer(12000)
                    .pipe(takeUntilDestroyed())
                    .subscribe(() => {
                        this._cacheStorageService.setIsFirstTime(false);
                    });
            }
        });
    }

    ngOnInit(): void {
        this._store$.dispatch(FirebaseActions.loadNavigation());
        this._store$.dispatch(FirebaseActions.loadSocialMedia());

        this.currentTheme$
            .pipe(takeUntil(this._destroyed$))
            .subscribe((theme) => {
                console.log(theme);
                this._cdr.markForCheck();
            });

        this._afAuth.authState
            .pipe(takeUntil(this._destroyed$))
            .subscribe((user) => {
                this.isAuth = !!user;
                if (!user) {
                    this.isModalDialogVisible.set(true);
                }
                this._cdr.markForCheck();
            });

        this.isExperienceDialogVisible$ = this._store$.pipe(
            takeUntil(this._destroyed$),
            select(selectIsModalOpen),
        );
        this.modalData$ = this._store$.pipe(
            takeUntil(this._destroyed$),
            select(selectModalData),
        );

        this.isFirstTime$
            .pipe(takeUntil(this._destroyed$))
            .subscribe((firstTime) => {
                if (firstTime) {
                    this._cdr.markForCheck();

                    timer(12000)
                        .pipe(takeUntil(this._destroyed$))
                        .subscribe(() => {
                            this._cacheStorageService.setIsFirstTime(false);
                            this._cdr.markForCheck();
                        });
                }
            });
    }

    public getModalInstance(visible: boolean): void {
        this.isModalDialogVisible.set(visible);
    }

    public prepareRoute(outlet: RouterOutlet) {
        return (
            outlet &&
            outlet.activatedRouteData &&
            outlet.activatedRouteData['animation']
        );
    }

    public closeModal() {
        this.isModalDialogVisible.set(false);
        this._cdr.markForCheck();
    }
}
