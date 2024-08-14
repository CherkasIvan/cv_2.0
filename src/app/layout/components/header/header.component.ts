import { Subject, Subscription, takeUntil } from 'rxjs';

import { NgClass, NgFor } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    computed,
    input,
} from '@angular/core';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';

import { Store, select } from '@ngrx/store';

import { INavigation } from '@core/models/navigation.interface';

import { selectAuth } from '@layout/store/auth-store/auth.selectors';
import { setLanguageSuccess } from '@layout/store/language-selector-store/language-selector.actions';
import { ILanguagesSelector } from '@layout/store/model/language-selector.interface';

import { LocalStorageService } from '@app/core/service/local-storage/local-storage.service';

import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle.component';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
    selector: 'cv-header',
    standalone: true,
    imports: [
        RouterLink,
        NgFor,
        RouterLinkActive,
        NgClass,
        DarkModeToggleComponent,
        LoginFormComponent,
    ],
    templateUrl: './header.component.html',
    styleUrls: [
        './header.component.scss',
        './header-dark-mode/header.component.dm.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Input() public navigationLinks: INavigation[] | null = [];
    @Output() public emittedModalShow = new EventEmitter<boolean>();
    public theme = input<boolean | null>();
    public currentLanguage = input<string>('EN');
    public isCheckedLanguage: boolean = false;
    public currentRoute: string = '';
    public isModalDialogVisible: boolean = false;
    public displayName = '';

    private _routerSubscription$: Subscription = new Subscription();
    private _destroyed$: Subject<void> = new Subject();

    constructor(
        private readonly _router: Router,
        private _cdr: ChangeDetectorRef,
        private _store$: Store<ILanguagesSelector>,
        private _localStorageService: LocalStorageService,
    ) {}

    public showDialogLogout() {
        this.isModalDialogVisible = true;
        this.emittedModalShow.emit(true);
    }

    public changeLanguage() {
        this.isCheckedLanguage = !this.isCheckedLanguage;
        this._store$.dispatch(setLanguageSuccess(this.isCheckedLanguage));
    }

    ngOnInit(): void {
        this._routerSubscription$.add(
            this._router.events
                .pipe(takeUntil(this._destroyed$))
                .subscribe((event) => {
                    event instanceof NavigationEnd
                        ? (this.currentRoute = event.url)
                        : null;
                }),
        );
        this._store$.pipe(takeUntil(this._destroyed$), select(selectAuth));
        this.displayName =
            this._localStorageService.checkLocalStorageUserName();

        this._cdr.markForCheck();
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
