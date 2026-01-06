import { Observable, timer } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
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
    ],
    templateUrl: './layout.component.html',
    styleUrls: [
        './layout.component.scss',
        './layout-dm/layout-dm.component.scss',
        './layout-media/layout-media.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _cdr = inject(ChangeDetectorRef);
    private readonly _store = inject(Store);
    private readonly _cacheStorageService = inject(CacheStorageService);
    private readonly _afAuth = inject(AngularFireAuth);

    private readonly _isFirstTimeSignal = computed(() =>
        this._cacheStorageService.isFirstTime(),
    );

    public readonly isFirstTime$ = toObservable(this._isFirstTimeSignal);
    public readonly routeClasses = ROUTER_CLASSES;
    public readonly startCardClasses = START_CARD_CLASSES;

    protected readonly _isModalDialogVisible = signal<boolean>(false);
    protected readonly _isAuth = signal<boolean>(false);

    public readonly isExperienceDialogVisible$ = this._store.pipe(
        select(selectIsModalOpen),
        takeUntilDestroyed(this._destroyRef),
    );

    public readonly currentTheme$ = this._store.pipe(
        select(darkModeSelector),
        takeUntilDestroyed(this._destroyRef),
    );

    public readonly navigation$ = this._store.pipe(
        select(selectNavigation),
        takeUntilDestroyed(this._destroyRef),
    );

    public readonly social$ = this._store.pipe(
        select(selectSocialMediaLinks),
        takeUntilDestroyed(this._destroyRef),
    );

    public readonly modalData$ = this._store.pipe(
        select(selectModalData),
        takeUntilDestroyed(this._destroyRef),
    );

    public constructor() {
        this._store.dispatch(FirebaseActions.loadNavigation());
        this._store.dispatch(FirebaseActions.loadSocialMedia());

        this.isFirstTime$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((firstTime: boolean) => {
                if (firstTime) {
                    timer(12000)
                        .pipe(takeUntilDestroyed(this._destroyRef))
                        .subscribe(() => {
                            this._cacheStorageService.setIsFirstTime(false);
                        });
                }
            });
    }

    public ngOnInit(): void {
        this._afAuth.authState
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((user) => {
                this._isAuth.set(!!user);
                if (!user) {
                    this._isModalDialogVisible.set(true);
                }
                this._cdr.markForCheck();
            });

        this.isFirstTime$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((firstTime: boolean) => {
                if (firstTime) {
                    this._cdr.markForCheck();

                    timer(12000)
                        .pipe(takeUntilDestroyed(this._destroyRef))
                        .subscribe(() => {
                            this._cacheStorageService.setIsFirstTime(false);
                            this._cdr.markForCheck();
                        });
                }
            });
    }

    public getModalInstance(visible: boolean): void {
        this._isModalDialogVisible.set(visible);
    }

    public preparERoute(outlet: RouterOutlet): string | null {
        return outlet?.activatedRouteData?.['animation'] || null;
    }

    public closeModal(): void {
        this._isModalDialogVisible.set(false);
        this._cdr.markForCheck();
    }
}
