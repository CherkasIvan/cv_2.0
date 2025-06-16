import { Observable, takeUntil } from 'rxjs';

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
        this._translateService.use(newLanguage).subscribe(() => {
            this._cacheStorageService.setLanguage(newLanguage);
            this._store$.dispatch(setLanguageSuccess(newLanguage));
        });
    }

    ngOnInit(): void {
        this.route.url.pipe(takeUntil(this._destroyed$)).subscribe((url) => {
            this.authPath = url.find((el) => el.path);
        });

        this._cacheStorageService
            .getLanguage()
            .then((storedLanguage) => {
                const languageToSet = storedLanguage || 'en';

                this._translateService.use(languageToSet).subscribe(() => {
                    this._cacheStorageService.setLanguage(languageToSet);
                    this._store$.dispatch(setLanguageSuccess(languageToSet));
                });
            })
            .catch((error) => {
                console.error('Error retrieving language:', error);
            });
    }
}
