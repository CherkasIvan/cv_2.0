import { Observable, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { DestroyService } from '@core/service/destroy/destroy.service';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { darkModeSelector } from '@store/dark-mode-store/dark-mode.selectors';
import { setLanguageSuccess } from '@store/language-selector-store/language.actions';
import { selectCurrentLanguage } from '@store/language-selector-store/language.selectors';
import { TDarkMode } from '@store/model/dark-mode.type';
import { TLanguages } from '@store/model/languages.type';

@Component({
    selector: 'cv-language-toggle',
    standalone: true,
    imports: [TranslateModule, NgClass, AsyncPipe],
    templateUrl: './language-toggle.component.html',
    providers: [DestroyService],
    styleUrls: [
        './language-toggle.component.scss',
        './language-toggle-dm/language-toggle-dm.component.scss',
        './language-toggle-mobile/language-toggle-mobile.component.scss',
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
        private _localStorageService: LocalStorageService,
    ) {}

    public changeLanguage() {
        this.isCheckedLanguage = !this.isCheckedLanguage;
        const newLanguage = this.isCheckedLanguage ? 'en' : 'ru';
        this._translateService.use(newLanguage).subscribe(() => {
            this._localStorageService.setLanguage(newLanguage);
            this._store$.dispatch(setLanguageSuccess(newLanguage));
        });
    }

    ngOnInit(): void {
        this.route.url.pipe(takeUntil(this._destroyed$)).subscribe((url) => {
            this.authPath = url.find((el) => el.path);
        });

        const storedLanguage = this._localStorageService.getLanguage();
        const languageToSet = storedLanguage || 'en';

        this._translateService.use(languageToSet).subscribe(() => {
            this._localStorageService.setLanguage(languageToSet);
            this._store$.dispatch(setLanguageSuccess(languageToSet));
        });

        this._store$
            .pipe(select(selectCurrentLanguage), takeUntil(this._destroyed$))
            .subscribe((language) => {
                this.currentLanguage = language;
                this.isCheckedLanguage = language === 'en';
                this._cdr.markForCheck();
            });
    }
}
