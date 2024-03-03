import { Subscription } from 'rxjs';

import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';

import { INavigation } from '@app/core/models/navigation.interface';

import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle.component';

@Component({
    selector: 'cv-header',
    standalone: true,
    imports: [
        RouterLink,
        NgFor,
        RouterLinkActive,
        NgClass,
        DarkModeToggleComponent,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    @Input() public navigationLinks: INavigation[] | null = [];

    public currentRoute: string = '';
    private _routerSubscription$: Subscription = new Subscription();

    constructor(private readonly _router: Router) {
        this._routerSubscription$.add(
            this._router.events.subscribe((event) => {
                event instanceof NavigationEnd
                    ? (this.currentRoute = event.url)
                    : null;
            }),
        );
    }

    // public openLoginModal() {
    //     this._modalService.openLoginModal();
    //     // .subscribe((action)=> {
    //     //   console.log('Action:' action)
    //     // });
    // }
}
