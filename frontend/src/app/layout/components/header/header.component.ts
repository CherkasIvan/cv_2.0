import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnChanges,
    OnInit,
    SimpleChanges,
    effect,
    inject,
    input,
    model,
    output,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';

import { Store } from '@ngrx/store';

import { TNavigation } from '@core/models/navigation.type';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';

import { selectAuthUser } from '@layout/store/auth-store/auth.selectors';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import { selectLogoUrl } from '@layout/store/images-store/images.selectors';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnChanges {
    // 🎯 Inputs/Outputs
    public navigationLinks = input<TNavigation[] | null>(null);
    public theme = model<boolean | null>(null);
    public emittedModalShow = output<boolean>();

    // 🔄 Internal state
    public sortedLinks: TNavigation[] = [];
    public route = '';
    public isModalDialogVisible = false;
    public displayName = '';
    public imageUrl = '';
    public isCheckedLanguage = false;

    // 🏗️ Injections
    private _router = inject(Router);
    private _store = inject(Store);
    private _cdr = inject(ChangeDetectorRef);
    private _cacheStorageService = inject(CacheStorageService);
    private _destroyRef = inject(DestroyRef);

    // 🔄 Observables
    private theme$ = toObservable(this.theme);
    private navigationLinks$ = toObservable(this.navigationLinks);

    ngOnInit(): void {
        this.setupRouterEvents();
        this.setupAuthUser();
        this.setupUserName();
        this.setupLanguage();
        this.setupLogo();
        this.setupThemeChanges();

        this._cacheStorageService.redirectToSavedRoute();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['navigationLinks'] && this.navigationLinks()) {
            this.updateSortedLinks();
        }

        if (changes['theme']) {
            this.dispatchLogoAction();
        }
    }

    // 🎯 Public methods
    public showDialogLogout(): void {
        this.isModalDialogVisible = true;
        this.emittedModalShow.emit(true);
    }

    public trackByPosition(index: number, item: TNavigation): number {
        return item.position;
    }

    // 🔒 Private methods
    private setupRouterEvents(): void {
        this._router.events
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    this.route = event.url;
                    this._cacheStorageService
                        .updateRoute(this.route)
                        .pipe(takeUntilDestroyed(this._destroyRef))
                        .subscribe();
                }
            });
    }

    private setupAuthUser(): void {
        this._store
            .select(selectAuthUser)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe();
    }

    private setupUserName(): void {
        effect(() => {
            this.displayName = this._cacheStorageService.userName();
            this._cdr.markForCheck();
        }, { allowSignalWrites: true });
    }

    private setupLanguage(): void {
        this._cacheStorageService
            .getLanguage()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((language) => {
                this.isCheckedLanguage = language === 'en';
                this._cdr.markForCheck();
            });
    }

    private setupLogo(): void {
        this._store
            .select(selectLogoUrl)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((imageUrl: string) => {
                this.imageUrl = imageUrl;
                this._cdr.markForCheck();
            });
    }

    private setupThemeChanges(): void {
        this.theme$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
            this.dispatchLogoAction();
        });
    }

    private updateSortedLinks(): void {
        if (this.navigationLinks()) {
            this.sortedLinks = [...this.navigationLinks()!].sort(
                (a, b) => a.position - b.position,
            );
        }
    }

    private dispatchLogoAction(): void {
        this._store.dispatch(ImagesActions.loadLogo({ mode: !this.theme() }));
    }
}
