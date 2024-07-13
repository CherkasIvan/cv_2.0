import { Subscription } from 'rxjs';

import { NgClass, NgFor } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
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
    styleUrls: [
        './header.component.scss',
        './header-dark-mode/header.component.dm.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
    @Input() public navigationLinks: INavigation[] | null = [];
    public theme = input<boolean | null>();
    @Output() public emittedModalShow = new EventEmitter<boolean>();

    public currentRoute: string = '';
    private _routerSubscription$: Subscription = new Subscription();
    public isModalDialogVisible: boolean = false;

    constructor(
        private readonly _router: Router,
        private _cdr: ChangeDetectorRef,
    ) {}

    public showDialog() {
        this.isModalDialogVisible = true;
        this.emittedModalShow.emit(true);
    }

    ngOnInit(): void {
        this._routerSubscription$.add(
            this._router.events.subscribe((event) => {
                event instanceof NavigationEnd
                    ? (this.currentRoute = event.url)
                    : null;
            }),
        );
        this._cdr.markForCheck();
    }
}
