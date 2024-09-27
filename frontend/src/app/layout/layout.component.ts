import { Observable, timer } from 'rxjs';

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

import { IEducationExperience } from '@core/models/education.interface';
import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
import { IWorkExperience } from '@core/models/work-experience.interface';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';
import { routeAnimations } from '@core/utils/animations/router-animations';
import { startCardFadeIn } from '@core/utils/animations/start-cart-fade-in';
import { startCardFadeOut } from '@core/utils/animations/start-cart-fade-out';

import { AnimationBgComponent } from './components/animation-bg/animation-bg.component';
import { ExperienceDialogComponent } from './components/experience-dialog/experience-dialog.component';
import { FirstTimeComponent } from './components/first-time/first-time.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoutFormComponent } from './components/logout-form/logout-form.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AuthComponent } from './pages/auth/auth.component';
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
import { IDarkMode } from './store/model/dark-mode.interface';

@Component({
    selector: 'cv-layout',
    standalone: true,
    animations: [routeAnimations, startCardFadeOut, startCardFadeIn],
    imports: [
        FooterComponent,
        HeaderComponent,
        RouterOutlet,
        AuthComponent,
        AnimationBgComponent,
        AsyncPipe,
        SpinnerComponent,
        LogoutFormComponent,
        ExperienceDialogComponent,
        FirstTimeComponent,
        NgClass,
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
    public isFirstTime!: boolean;
    public isModalDialogVisible: boolean = false;
    public isExperienceDialogVisible$!: Observable<boolean>;
    public modalData$!: Observable<
        IWorkExperience | IEducationExperience | null
    >;

    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    public getModalInstance($event: boolean) {
        this.isModalDialogVisible = $event;
    }

    public navigation$: Observable<INavigation[]> = this._store$.pipe(
        select(selectNavigation),
    );

    public social$: Observable<ISocialMedia[]> = this._store$.pipe(
        select(selectSocialMediaLinks),
    );

    constructor(
        private _store$: Store<
            IDarkMode | INavigation | ISocialMedia | { modal: ModalState }
        >,
        @Inject(AngularFireAuth) public afAuth: AngularFireAuth,
        private _localStorageService: LocalStorageService,
        private _cdr: ChangeDetectorRef,
    ) {
        this.isFirstTime = this._localStorageService.getIsFirstTime();
    }

    ngOnInit(): void {
        this._store$.dispatch(FirebaseActions.getNavigation({ imgName: '' }));
        this._store$.dispatch(FirebaseActions.getSocialMedia({ imgName: '' }));

        this.afAuth.authState.subscribe((user) => {
            if (!user) {
                this.isModalDialogVisible = true;
            }
        });

        this.isExperienceDialogVisible$ = this._store$.pipe(
            select(selectIsModalOpen),
        );
        this.modalData$ = this._store$.pipe(select(selectModalData));

        if (this.isFirstTime) {
            timer(5000).subscribe(() => {
                this.isFirstTime = false;
                this._localStorageService.setIsFirstTime(false);
                this._cdr.markForCheck();
            });
        }
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
    }
}
