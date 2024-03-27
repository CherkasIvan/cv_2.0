import { Subscription } from 'rxjs';

import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';

import { INavigation } from '@core/models/navigation.interface';

import { ModalDialogResult } from '@app/core/enum/modal-dialog.base.enum';

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
    }

    public closeModal(isConfirmed: any) {
        this.isModalDialogVisible = false;
        // if (isConfirmed) {
        //   this.showToast('modal dialog', "modal dialog is confirmed");
        // }
        // else {
        //   this.showToast('modal dialog', "modal dialog is closed");
        // }
    }
}
