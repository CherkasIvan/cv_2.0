import { Observable } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
import { FirebaseService } from '@core/service/firebase/firebase.service';

import { routeAnimations } from '@app/core/utils/animations/router-animations';

import { AnimationBgComponent } from './components/animation-bg/animation-bg.component';
import { ConnectionModalComponent } from './components/connection-modal/connection-modal.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AuthComponent } from './pages/auth/auth.component';
import { darkModeSelector } from './store/dark-mode-store/dark-mode.selectors';

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
        ConnectionModalComponent,
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
})
export class LayoutComponent {
    public isModalDialogVisible: boolean = false;
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    public getModalInstance($event: boolean) {
        this.isModalDialogVisible = $event;
    }
    public navigation$: Observable<INavigation[]> =
        this._firebaseService.getNavigation();

    public social$: Observable<ISocialMedia[]> =
        this._firebaseService.getSocialMediaLinks();
    constructor(
        private readonly _firebaseService: FirebaseService,
        private _store$: Store,
    ) {}

    public prepareRoute(outlet: RouterOutlet) {
        return (
            outlet &&
            outlet.activatedRouteData &&
            outlet.activatedRouteData['animation']
        );
    }

    public closeModal() {
        this.isModalDialogVisible = false;
        // if (isConfirmed) {
        //   this.showToast('modal dialog', "modal dialog is confirmed");
        // }
        // else {
        //   this.showToast('modal dialog', "modal dialog is closed");
        // }
    }
    // public currentRoute!: string;
    // public navigation$: Observable<INavigation[]> =
    //     this._firebaseService.getNavigation();
    // private _routerSubscription$: Subscription = new Subscription();
    // constructor(
    //     private readonly _router: Router,
    //     private readonly _firebaseService: FirebaseService,
    // ) {
    //     this._routerSubscription$.add(
    //         this._router.events.subscribe((event) => {
    //             event instanceof NavigationEnd
    //                 ? (this.currentRoute = event.url)
    //                 : null;
    //         }),
    //     );
    // }
    // ngOnDestroy(): void {
    //     this._routerSubscription$.unsubscribe();
    // }

    // constructor(private _firebaseService: FirebaseService) {
    //     this._firebaseService
    //         .getNavigation()
    //         .subscribe((el) => console.log(el));
    // }
}
