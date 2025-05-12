import { Subject, pipe, takeUntil, timer } from 'rxjs';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from '@core/service/auth/auth.service';
import { listAnimation } from '@core/utils/animations/translate-fade-out';

import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'cv-first-time',
    standalone: true,
    animations: [listAnimation],
    templateUrl: './first-time.component.html',
    styleUrls: [
        './styles/first-time.component.scss',
        './styles/first-time-mobile.component.scss',
        './styles/first-time-dm.component.scss',
    ],
})
export class FirstTimeComponent implements OnInit, OnDestroy {
    public isAuth = false;
    public showTranslated = false;
    public persons: any[] = [];
    public titles: any[] = [];

    private _destroyed$ = new Subject();

    constructor(
        private _authService: AuthService,
        private _cd: ChangeDetectorRef,
        private _translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.isAuth = this._authService.isAuth$.getValue();

        this._translateService
            .get('FIRST_TIME.PERSONS')
            .pipe(takeUntil(this._destroyed$))
            .subscribe((translations) => {
                this.persons = translations;
            });

        this._translateService
            .get('FIRST_TIME.TITLES')
            .pipe(takeUntil(this._destroyed$))
            .subscribe((translations) => {
                this.titles = translations;
            });

        timer(6000).subscribe(() => {
            this.showTranslated = true;
            this._cd.markForCheck();
        });
    }
    ngOnDestroy(): void {}
}
