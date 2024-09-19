import { Observable } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
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
import { routeAnimations } from '@core/utils/animations/router-animations';

import { AnimationBgComponent } from './components/animation-bg/animation-bg.component';
import { ExperienceDialogComponent } from './components/experience-dialog/experience-dialog.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoutFormComponent } from './components/logout-form/logout-form.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AuthComponent } from './pages/auth/auth.component';
import { darkModeSelector } from './store/dark-mode-store/dark-mode.selectors';
import { ExperienceActions } from './store/experience-dialog-store/experience-dialog.actions';
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
    animations: [routeAnimations],
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
        NgClass,
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
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
    ) {}

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
