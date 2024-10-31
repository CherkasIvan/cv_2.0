import { Subject, takeUntil } from 'rxjs';

import { NgClass, NgFor } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
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

import { Store, select } from '@ngrx/store';

import { INavigation } from '@core/models/navigation.interface';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';
import { TranslationService } from '@core/service/translation/translation.service';

import { selectAuth } from '@layout/store/auth-store/auth.selectors';
import { setLanguageSuccess } from '@layout/store/language-selector-store/language-selector.actions';
import { TLanguages } from '@layout/store/model/languages.type';

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

    private _destroyed$: Subject<void> = new Subject();

    constructor(
        private readonly _router: Router,
        private _cdr: ChangeDetectorRef,
        @Inject(Store) private _store$: Store<TLanguages>,
        private _localStorageService: LocalStorageService,
        private _translationService: TranslationService,
    ) {}

    public showDialogLogout() {
        this.isModalDialogVisible = true;
        this.emittedModalShow.emit(true);
    }

    public changeLanguage() {
        this.isCheckedLanguage = !this.isCheckedLanguage;
        const newLanguage = this.isCheckedLanguage ? 'en' : 'ru';
        this._localStorageService.setLanguage(newLanguage);
        this._store$.dispatch(setLanguageSuccess(newLanguage));
        this.translateNavigationLinks(newLanguage);
    }

    private translateNavigationLinks(language: string): void {
        if (this.navigationLinks) {
            this.navigationLinks = this.navigationLinks.map((link) => ({
                ...link,
                value: this._translationService.getTranslation(
                    link.value,
                    language,
                ),
            }));
        }
    }

    ngOnInit(): void {
        this._router.events
            .pipe(takeUntil(this._destroyed$))
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    this.currentRoute = event.url;
                    this._localStorageService.updateCurrentRoute(
                        this.currentRoute,
                    );
                }
            });

        this._store$
            .pipe(takeUntil(this._destroyed$), select(selectAuth))
            .subscribe();
        this.displayName =
            this._localStorageService.checkLocalStorageUserName();
        this._localStorageService.redirectToSavedRoute();
        this.isCheckedLanguage =
            this._localStorageService.getLanguage() === 'en';
        // this.loadTranslations(this.isCheckedLanguage ? 'en' : 'ru');
        this._cdr.markForCheck();
    }

    // private loadTranslations(language: string): void {
    //     this._translationService
    //         .loadTranslations(language)
    //         .subscribe((translations) => {
    //             this._translationService.setTranslations(
    //                 language,
    //                 translations,
    //             );
    //             this.translateNavigationLinks(language);
    //         });
    // }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
