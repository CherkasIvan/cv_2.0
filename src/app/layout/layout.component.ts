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

import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
import { routeAnimations } from '@core/utils/animations/router-animations';

import { AnimationBgComponent } from './components/animation-bg/animation-bg.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoutFormComponent } from './components/logout-form/logout-form.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AuthComponent } from './pages/auth/auth.component';
import { darkModeSelector } from './store/dark-mode-store/dark-mode.selectors';
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
        NgClass,
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
    public isModalDialogVisible: boolean = false;
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
        private _store$: Store<IDarkMode | INavigation | ISocialMedia>,
        @Inject(AngularFireAuth) public afAuth: AngularFireAuth,
    ) {}

    ngOnInit(): void {
        this._store$.dispatch(FirebaseActions.getNavigation());
        this._store$.dispatch(FirebaseActions.getSocialMedia());

        this.afAuth.authState.subscribe((user) => {
            if (!user) {
                this.isModalDialogVisible = true;
            }
        });
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
