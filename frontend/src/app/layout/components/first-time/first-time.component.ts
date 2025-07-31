import { timer } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '@core/service/auth/auth.service';
import { listAnimation } from '@core/utils/animations/translate-fade-out';

import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'cv-first-time',
    standalone: true,
    animations: [listAnimation],
    templateUrl: './first-time.component.html',
    styleUrls: ['./first-time.component.scss'],
})
export class FirstTimeComponent {
    private _authService = inject(AuthService);
    private _translateService = inject(TranslateService);
    private _cd = inject(ChangeDetectorRef);
    private _destroyRef = inject(DestroyRef);

    public isAuth = signal(this._authService.isAuthenticated());
    public showTranslated = signal(false);
    public persons = signal<any[]>([]);
    public titles = signal<any[]>([]);

    constructor() {
        this._initTranslations();
        this._initTimer();
    }

    private _initTranslations(): void {
        this._translateService
            .get('FIRST_TIME.PERSONS')
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((translations) => {
                this.persons.set(translations);
            });

        this._translateService
            .get('FIRST_TIME.TITLES')
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((translations) => {
                this.titles.set(translations);
            });
    }

    private _initTimer(): void {
        timer(6000)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                this.showTranslated.set(true);
                this._cd.markForCheck();
            });
    }
}
