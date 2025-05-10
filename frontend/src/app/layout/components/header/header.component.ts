import { Observable } from 'rxjs';

import { NgClass, NgFor } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
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
import { DestroyService } from '@core/service/destroy/destroy.service';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { TranslateModule } from '@ngx-translate/core';
import { selectAuth } from '@store/auth-store/auth.selectors';
import { ImagesActions } from '@store/images-store/images.actions';
import { selectLogoUrl } from '@store/images-store/images.selectors';
import { TLanguages } from '@store/model/languages.type';

import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle.component';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';

@Component({
    selector: 'cv-header',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        NgClass,
        NgFor,
        DarkModeToggleComponent,
        LanguageToggleComponent,
        TranslateModule,
    ],
    templateUrl: './header.component.html',
    styleUrls: [
        './header.component.scss',
        './header-dm/header-dm.component.scss',
        './header-mobile/header-mobile.component.scss',
    ],
    providers: [DestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnChanges {
    @Input() public navigationLinks: INavigation[] | null = null;
    @Input() public theme: boolean | null = null;
    @Output() public emittedModalShow = new EventEmitter<boolean>();
    public currentLanguage: string = 'EN';
    public isCheckedLanguage: boolean = false;
    public currentRoute: string = '';
    public isModalDialogVisible: boolean = false;
    public displayName = '';
    public imageUrl: string = '';

    protected readonly _locales = ['en', 'ru'];
    protected isCollapsed = true;

    constructor(
        @Inject(Router) private readonly _router: Router,
        @Inject(Store) private _store$: Store<TLanguages>,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
        private _cdr: ChangeDetectorRef,
        private _localStorageService: LocalStorageService,
    ) {}

    public showDialogLogout() {
        this.isModalDialogVisible = true;
        this.emittedModalShow.emit(true);
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
            .pipe(takeUntil(this._destroyed$), select(selectLogoUrl))
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

    trackByPosition(index: number, item: INavigation): number {
        return item.position;
    }
}
