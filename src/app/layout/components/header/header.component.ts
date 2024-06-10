import { Subscription } from 'rxjs';

import { NgClass, NgFor } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    input,
} from '@angular/core';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';

import { INavigation } from '@core/models/navigation.interface';

import { ConnectionModalComponent } from '../connection-modal/connection-modal.component';
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
        ConnectionModalComponent,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    @Input() public navigationLinks: INavigation[] | null = [];
    public theme = input<boolean | null>();
    @Output() public emittedModalShow = new EventEmitter<boolean>();

    public currentRoute: string = '';
    private _routerSubscription$: Subscription = new Subscription();
    public isModalDialogVisible: boolean = false;

    constructor(private readonly _router: Router) {
        console.log(this.theme());
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
