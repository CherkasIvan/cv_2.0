import { Subject } from 'rxjs';

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
    SimpleChanges,
} from '@angular/core';
import {
    NavigationEnd,
    Event as NavigationEvent,
    Router,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';

import { takeUntil } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { INavigation } from '@core/models/navigation.interface';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';
import { TranslationService } from '@core/service/translation/translation.service';

import { selectAuth } from '@layout/store/auth-store/auth.selectors';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import { selectImageUrl } from '@layout/store/images-store/images.selectors';
import { setLanguageSuccess } from '@layout/store/language-selector-store/language.actions';
import { TLanguages } from '@layout/store/model/languages.type';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle.component';

@Component({
    selector: 'cv-header',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        NgClass,
        NgFor,
        DarkModeToggleComponent,
        TranslateModule,
    ],
    templateUrl: './header.component.html',
    styleUrls: [
        './header.component.scss',
        './header-dark-mode/header.component.dm.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Input() public navigationLinks: INavigation[] | null = null;
    @Input() public theme: boolean | null = null;
    @Output() public emittedModalShow = new EventEmitter<boolean>();
    public currentLanguage: string = 'EN';
    public isCheckedLanguage: boolean = false;
    public currentRoute: string = '';
    public isModalDialogVisible: boolean = false;
    public displayName = '';
    public imageUrl: string = '';

    private _destroyed$: Subject<void> = new Subject();
    protected readonly _locales = ['en', 'ru'];
    protected isCollapsed = true;

    constructor(
        @Inject(Router) private readonly _router: Router,
        @Inject(Store) private _store$: Store<TLanguages>,
        @Inject(TranslateService)
        private readonly _translateService: TranslateService,
        private _cdr: ChangeDetectorRef,
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
        console.log(`Changing language to: ${newLanguage}`);
        this._translateService.use(newLanguage).subscribe(() => {
            console.log(`Language changed to: ${newLanguage}`);
            this._localStorageService.setLanguage(newLanguage);
            this._store$.dispatch(setLanguageSuccess(newLanguage));
            this.translateNavigationLinks(newLanguage);
        });
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
            .subscribe((event: NavigationEvent) => {
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

        this._store$
            .pipe(takeUntil(this._destroyed$), select(selectImageUrl))
            .subscribe((imageUrl: string) => {
                this.imageUrl = imageUrl;
                this._cdr.markForCheck();
            });

        this._store$.dispatch(ImagesActions.getLogo({ mode: !this.theme }));
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['navigationLinks'] && this.navigationLinks) {
            this.navigationLinks = [...this.navigationLinks].sort(
                (a, b) => a.position - b.position,
            );
        }
        this._store$.dispatch(ImagesActions.getLogo({ mode: !this.theme }));
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    trackByPosition(index: number, item: INavigation): number {
        return item.position;
    }
}
