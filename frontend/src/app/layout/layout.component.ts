import { Observable, takeUntil, timer } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { RouterOutlet } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { IExperience } from '@core/models/experience.interface';
import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
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
import { LogoutFormComponent } from './components/logout-form/logout-form.component';
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
import { TDarkMode } from './store/model/dark-mode.type';

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
        LogoutFormComponent,
        DarkAnimationLayoutComponent,
        ExperienceDialogComponent,
        FirstTimeComponent,
        TranslateModule,
        NgClass,
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    providers: [DestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
    public isFirstTime$!: Observable<boolean>;
    public isAuth: boolean = false;
    public isModalDialogVisible: boolean = false;
    public isExperienceDialogVisible$!: Observable<boolean>;
    public modalData$!: Observable<IExperience | null>;

    public currentTheme$: Observable<boolean> = this._store$.pipe(
        takeUntil(this._destroyed$),
        select(darkModeSelector),
    );

    public navigation$: Observable<INavigation[]> = this._store$.pipe(
        takeUntil(this._destroyed$),
        select(selectNavigation),
    );

    public social$: Observable<ISocialMedia[]> = this._store$.pipe(
        takeUntil(this._destroyed$),
        select(selectSocialMediaLinks),
    );

    constructor(
        @Inject(Store)
        private _store$: Store<
            TDarkMode | INavigation | ISocialMedia | { modal: ModalState }
        >,
        @Inject(AngularFireAuth) public afAuth: AngularFireAuth,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
        private _cacheStorageService: CacheStorageService,
        private _cdr: ChangeDetectorRef,
    ) {
        this.isFirstTime$ = this._cacheStorageService.getIsFirstTime();
    }

    ngOnInit(): void {
        this._store$.dispatch(FirebaseActions.getNavigation({ imgName: '' }));
        this._store$.dispatch(FirebaseActions.getSocialMedia({ imgName: '' }));

        this.afAuth.authState
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
