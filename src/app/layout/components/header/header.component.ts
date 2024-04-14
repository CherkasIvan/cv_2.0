import { Subscription } from 'rxjs';

import { NgClass, NgFor } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';

import { INavigation } from '@core/models/navigation.interface';

import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
    selector: 'cv-header',
    standalone: true,
    imports: [
        RouterLink,
        NgFor,
        RouterLinkActive,
        NgClass,
        DarkModeToggleComponent,
        LoginModalComponent,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    @Input() public navigationLinks: INavigation[] | null = [];
    @Output() public emittedModalShow = new EventEmitter<boolean>();

    public currentRoute: string = '';
    private _routerSubscription$: Subscription = new Subscription();
    public isModalDialogVisible: boolean = false;

    constructor(private readonly _router: Router) {
        this._routerSubscription$.add(
            this._router.events.subscribe((event) => {
                event instanceof NavigationEnd
                    ? (this.currentRoute = event.url)
                    : null;
            }),
        );
    }

    public showDialog() {
        this.isModalDialogVisible = true;
        this.emittedModalShow.emit(true);
    }
}
