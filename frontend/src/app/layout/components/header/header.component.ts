import { Observable } from 'rxjs';

import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnChanges,
    OnInit,
    SimpleChanges,
    input,
    model,
    output,
} from '@angular/core';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';

import { takeUntil } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { INavigation } from '@core/models/navigation.interface';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { DestroyService } from '@core/service/destroy/destroy.service';

import { selectAuth } from '@layout/store/auth-store/auth.selectors';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import { selectLogoUrl } from '@layout/store/images-store/images.selectors';
import { TLanguages } from '@layout/store/model/languages.type';

import { TranslateModule } from '@ngx-translate/core';

import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle.component';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';

@Component({
    selector: 'cv-header',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        NgClass,
        DarkModeToggleComponent,
        LanguageToggleComponent,
        TranslateModule,
    ],
    templateUrl: './header.component.html',
    styleUrls: [
        './header.component.scss',
        './header-dark-mode/header.component.dm.scss',
    ],
    providers: [DestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnChanges {
    public navigationLinks = input<INavigation[] | null>(null);

    public theme = model<boolean | null>(null);

    public emittedModalShow = output<boolean>();

    public currentLanguage: string = 'EN';
    public isCheckedLanguage: boolean = false;
    public route: string = '';
    public isModalDialogVisible: boolean = false;
    public displayName = '';
    public imageUrl: string = '';

    protected readonly _locales = ['en', 'ru'];
    protected isCollapsed = true;

    constructor(
        @Inject(Router) private readonly _router: Router,
        @Inject(Store) private _store$: Store<TLanguages>,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
        @Inject(ChangeDetectorRef) private _cdr: ChangeDetectorRef,
        private _cacheStorageService: CacheStorageService,
    ) {}

    public showDialogLogout() {
        this.isModalDialogVisible = true;
        this.emittedModalShow.emit(true);
    }

    ngOnInit(): void {
        this._router.events
            .pipe(takeUntil(this._destroyed$))
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    this.route = event.url;
                    console.log(this.route);
                    this._cacheStorageService
                        .updateRoute(this.route)
                        .pipe(takeUntil(this._destroyed$))
                        .subscribe();
                }
            });

        this._store$
            .pipe(takeUntil(this._destroyed$), select(selectAuth))
            .subscribe();

        this._cacheStorageService
            .getUserName()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((name) => {
                this.displayName = name;
                this._cdr.markForCheck();
            });

        this._cacheStorageService.redirectToSavedRoute();

        this._cacheStorageService
            .getLanguage()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((language) => {
                this.isCheckedLanguage = language === 'en';
                this._cdr.markForCheck();
            });

        this._store$
            .pipe(takeUntil(this._destroyed$), select(selectLogoUrl))
            .subscribe((imageUrl: string) => {
                this.imageUrl = imageUrl;
                this._cdr.markForCheck();
            });

        this._store$.dispatch(ImagesActions.getLogo({ mode: !this.theme() }));
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['navigationLinks'] && this.navigationLinks()) {
            const sortedLinks = [...this.navigationLinks()!].sort(
                (a, b) => a.position - b.position,
            );
        }
        this._store$.dispatch(ImagesActions.getLogo({ mode: !this.theme() }));
    }

    trackByPosition(index: number, item: INavigation): number {
        return item.position;
    }
}
