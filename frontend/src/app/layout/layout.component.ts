import { Observable, takeUntil, timer } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { RouterOutlet } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { DestroyService } from '@core/service/destroy/destroy.service';
import { routeAnimations } from '@core/utils/animations/router-animations';
import { startCardFadeIn } from '@core/utils/animations/start-cart-fade-in';
import { startCardFadeOut } from '@core/utils/animations/start-cart-fade-out';

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
import { ModalState } from './store/experience-dialog-store/experience-dialog.reducers';
import {
    selectIsModalOpen,
    selectModalData,
} from './store/experience-dialog-store/experience-dialog.selectors';
import { FirebaseActions } from './store/firebase-store/firebase.actions';
import {
    selectNavigation,
    selectSocialMediaLinks,
} from './store/firebase-store/firebase.selectors';
import { TWorkExperience } from '@core/models/work-experience.type';
import { TEducationExperience } from '@core/models/education-experience.type';
import { TNavigation } from '@core/models/navigation.type';
import { TSocialMedia } from '@core/models/social-media.type';

@Component({
    selector: 'cv-layout',
    standalone: true,
    animations: [routeAnimations, startCardFadeOut, startCardFadeIn],
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
    styleUrls: ['./layout.component.scss', './layout-dm/layout-dm.component.scss', './layout-media/layout-media.component.scss'],
    providers: [DestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
    
    public isFirstTime$: Observable<boolean>;
    public isAuth: boolean = false;
    public isModalDialogVisible: boolean = false;
    public isExperienceDialogVisible$!: Observable<boolean>;
    public modalData$!: Observable<TWorkExperience | TEducationExperience | null>;

    private _destroyed$ = inject(DestroyService);
    private _cdr = inject(ChangeDetectorRef);
    private _store$ = inject(Store);
    private _cacheStorageService = inject(CacheStorageService);
    private _afAuth = inject(AngularFireAuth);
    
    // Сигнал для текущей темы
    public currentTheme = signal<boolean>(false);

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
        this.isFirstTime$ = this._cacheStorageService.getIsFirstTime();
    }

    ngOnInit(): void {
        this._store$.dispatch(FirebaseActions.getNavigation({ imgName: '' }));
        this._store$.dispatch(FirebaseActions.getSocialMedia({ imgName: '' }));

        // Подписываемся на изменения темы
        this.currentTheme$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(theme => {
                this.currentTheme.set(theme);
                this._cdr.markForCheck();
            });

        this._afAuth.authState
            .pipe(takeUntil(this._destroyed$))
            .subscribe((user) => {
                this.isAuth = !!user;
                if (!user) {
                    this.isModalDialogVisible = true;
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

    public getModalInstance($event: boolean) {
        this.isModalDialogVisible = $event;
        this._cdr.markForCheck();
    }

    public prepareRoute(outlet: RouterOutlet) {
        return (
            outlet &&
            outlet.activatedRouteData &&
            outlet.activatedRouteData['animation']
        );
    }

    public closeModal() {
        this.isModalDialogVisible = false;
        this._cdr.markForCheck();
    }
}