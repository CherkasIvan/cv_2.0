import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthComponent } from './pages/auth/auth.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [FooterComponent, HeaderComponent, RouterOutlet, AuthComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
})
export class LayoutComponent {
    public navigation: any = [
        { link: 'main', value: 'Домашнняя страница' },
        { link: 'experience', value: 'опыт работы и образование' },
        { link: 'projects', value: 'проекты' },
        { link: 'technologies', value: 'технологии' },
    ];

    public social = [
        {
            link: 'https://www.linkedin.com/in/ivan-cherkas-723b411a2',
            value: 'linkedin',
        },
        { link: 'https://github.com/CherkasIvan', value: 'github' },
        { link: 'https://t.me/IvanCherkas', value: 'telegram' },
        { link: 'https://www.facebook.com/ivan.cherkas', value: 'facebook' },
        { link: 'cherkas.ivan13@gmail.com', value: 'mail' },
        { link: 'https://vk.com/cherkasss', value: 'vkontakte' },
        { link: 'live:.cid.270d4d79826c9a4d', value: 'skype' },
    ];

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

    constructor() {}
}
