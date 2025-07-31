import { Observable, map, switchMap, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { DestroyService } from '@core/service/destroy/destroy.service';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { setLanguageSuccess } from '@layout/store/language-selector-store/language.actions';
import { TDarkMode } from '@layout/store/model/dark-mode.type';
import { TLanguages } from '@layout/store/model/languages.type';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'cv-language-toggle',
    standalone: true,
    imports: [TranslateModule, NgClass, AsyncPipe],
    templateUrl: './language-toggle.component.html',
    providers: [DestroyService],
    styleUrls: [
        './language-toggle.component.scss',
        './language-toggle-dark-mode/language-toggle.component.dm.scss',
    ],
})
export class LanguageToggleComponent implements OnInit {
    public currentLanguage: string = 'EN';
    public isCheckedLanguage: boolean = false;
    public authPath!: any;
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    protected readonly _locales = ['en', 'ru'];
    protected isCollapsed = true;

    constructor(
        private route: ActivatedRoute,
        @Inject(Store) private _store$: Store<TLanguages | TDarkMode>,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
        @Inject(TranslateService)
        private readonly _translateService: TranslateService,
        private _cdr: ChangeDetectorRef,
        private _cacheStorageService: CacheStorageService,
    ) {}

    public changeLanguage() {
        this.isCheckedLanguage = !this.isCheckedLanguage;
        const newLanguage = this.isCheckedLanguage ? 'en' : 'ru';

        this._translateService
            .use(newLanguage)
            .pipe(
                takeUntil(this._destroyed$),
                switchMap(() =>
                    this._cacheStorageService.setLanguage(newLanguage),
                ),
                takeUntil(this._destroyed$),
            )
            .subscribe({
                next: () => {
                    this._store$.dispatch(setLanguageSuccess(newLanguage));
                    this._cdr.markForCheck();
                },
                error: (err) => console.error('Error changing language:', err),
            });
    }

    ngOnInit(): void {
        this.route.url.pipe(takeUntil(this._destroyed$)).subscribe((url) => {
            this.authPath = url.find((el) => el.path);
            this._cdr.markForCheck();
        });

        this._cacheStorageService
            .getLanguage()
            .pipe(
                takeUntil(this._destroyed$),
                switchMap((storedLanguage) => {
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
                next: (languageToSet) => {
                    this._store$.dispatch(setLanguageSuccess(languageToSet));
                    this._cdr.markForCheck();
                },
                error: (err) =>
                    console.error('Error initializing language:', err),
            });
    }
}
