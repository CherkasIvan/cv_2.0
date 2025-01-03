import { Router } from 'express';
import { Observable, Subject, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { LocalStorageService } from '@core/service/local-storage/local-storage.service';
import { TranslationService } from '@core/service/translation/translation.service';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { setLanguageSuccess } from '@layout/store/language-selector-store/language.actions';
import { selectCurrentLanguage } from '@layout/store/language-selector-store/language.selectors';
import { TDarkMode } from '@layout/store/model/dark-mode.type';
import { TLanguages } from '@layout/store/model/languages.type';

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
export class LanguageToggleComponent implements OnInit, OnDestroy {
    public currentLanguage: string = 'EN';
    public isCheckedLanguage: boolean = false;
    public authPath!: any;
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    private _destroyed$: Subject<void> = new Subject();
    protected readonly _locales = ['en', 'ru'];
    protected isCollapsed = true;

    constructor(
        private route: ActivatedRoute,
        @Inject(Store) private _store$: Store<TLanguages | TDarkMode>,
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
        this._store$
            .pipe(select(selectCurrentLanguage), takeUntil(this._destroyed$))
            .subscribe((language) => {
                this.currentLanguage = language;
                this.isCheckedLanguage = language === 'en';
                this._cdr.markForCheck();
            });

        const storedLanguage = this._localStorageService.getLanguage();
        if (storedLanguage) {
            this._store$.dispatch(setLanguageSuccess(storedLanguage));
        } else {
            this._store$.dispatch(setLanguageSuccess('en'));
        }

        this.isCheckedLanguage =
            this._localStorageService.getLanguage() === 'en';
        console.log(this.isCheckedLanguage);
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
