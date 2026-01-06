import { map, switchMap } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnInit,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { setLanguageSuccess } from '@layout/store/language-selector-store/language.actions';
import { TDarkModeState } from '@layout/store/model/dark-mode-state.type';
import { TLanguagesState } from '@layout/store/model/languages-state.type';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'cv-language-toggle',
    standalone: true,
    imports: [TranslateModule, NgClass, AsyncPipe],
    templateUrl: './language-toggle.component.html',
    styleUrls: [
        './language-toggle.component.scss',
        './language-toggle-dark-mode/language-toggle.component.dm.scss',
    ],
})
export class LanguageToggleComponent implements OnInit {
    private readonly _route = inject(ActivatedRoute);
    private readonly _store =
        inject<Store<TLanguagesState | TDarkModeState>>(Store);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _translateService = inject(TranslateService);
    private readonly _cdr = inject(ChangeDetectorRef);
    private readonly _cacheStorageService = inject(CacheStorageService);

    public currentLanguage: string = 'EN';
    public isCheckedLanguage: boolean = false;
    public authPath!: any;

    public readonly currentTheme$ = this._store.pipe(
        select(darkModeSelector),
        takeUntilDestroyed(this._destroyRef),
    );

    protected readonly _locales = ['en', 'ru'];
    protected _isCollapsed = true;

    public changeLanguage(): void {
        this.isCheckedLanguage = !this.isCheckedLanguage;
        const newLanguage = this.isCheckedLanguage ? 'en' : 'ru';

        this._translateService
            .use(newLanguage)
            .pipe(
                takeUntilDestroyed(this._destroyRef),
                switchMap(() =>
                    this._cacheStorageService.setLanguage(newLanguage),
                ),
            )
            .subscribe({
                next: () => {
                    this._store.dispatch(setLanguageSuccess(newLanguage));
                    this._cdr.markForCheck();
                },
                error: (err) => console.error('Error changing language:', err),
            });
    }

    public ngOnInit(): void {
        this._route.url
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((url) => {
                this.authPath = url.find((el) => el.path);
                this._cdr.markForCheck();
            });

        this._cacheStorageService
            .getLanguage()
            .pipe(
                takeUntilDestroyed(this._destroyRef),
                switchMap((storedLanguage: string) => {
                    const languageToSet = storedLanguage || 'en';
                    return this._translateService.use(languageToSet).pipe(
                        switchMap(() =>
                            this._cacheStorageService.setLanguage(
                                languageToSet,
                            ),
                        ),
                        map(() => languageToSet),
                    );
                }),
            )
            .subscribe({
                next: (languageToSet: string) => {
                    this._store.dispatch(setLanguageSuccess(languageToSet));
                    this._cdr.markForCheck();
                },
                error: (err: any) =>
                    console.error('Error initializing language:', err),
            });
    }
}
