import { Observable } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
import { FirebaseService } from '@core/service/firebase/firebase.service';

import { routeAnimations } from '@app/core/utils/animations/router-animations';

import { AnimationBgComponent } from './components/animation-bg/animation-bg.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthComponent } from './pages/auth/auth.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    animations: [routeAnimations],
    imports: [
        FooterComponent,
        HeaderComponent,
        RouterOutlet,
        AuthComponent,
        AnimationBgComponent,
        AsyncPipe,
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
})
export class LayoutComponent {
    public navigation$: Observable<INavigation[]> =
        this._firebaseService.getNavigation();

    public social$: Observable<ISocialMedia[]> =
        this._firebaseService.getSocialMediaLinks();
    constructor(private readonly _firebaseService: FirebaseService) {}

    public prepareRoute(outlet: RouterOutlet) {
        return (
            outlet &&
            outlet.activatedRouteData &&
            outlet.activatedRouteData['animation']
        );
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
