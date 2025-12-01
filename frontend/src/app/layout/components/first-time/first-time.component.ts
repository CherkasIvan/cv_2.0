import { timer } from 'rxjs';

import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '@core/service/auth/auth.service';

import ALL_ANIMATION_CLASSES, {
    AllAnimationClassType,
} from '@assets/constant/animations.const';

import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'cv-first-time',
    standalone: true,
    templateUrl: './first-time.component.html',
    styleUrls: ['./first-time.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstTimeComponent {
    private _authService = inject(AuthService);
    private _translateService = inject(TranslateService);

    public isAuth = signal(this._authService.isAuthenticated());
    public showTranslated = signal(false);
    public persons = signal<any[]>([]);
    public titles = signal<any[]>([]);

    public readonly cssClasses = ALL_ANIMATION_CLASSES;

    constructor() {
        this._initTranslations();
        this._initTimer();
    }

    private _initTranslations(): void {
        this._translateService
            .get('FIRST_TIME.PERSONS')
            .pipe(takeUntilDestroyed())
            .subscribe((translations) => {
                this.persons.set(translations);
            });

        this._translateService
            .get('FIRST_TIME.TITLES')
            .pipe(takeUntilDestroyed())
            .subscribe((translations) => {
                this.titles.set(translations);
            });
    }

    private _initTimer(): void {
        timer(6000)
            .pipe(takeUntilDestroyed())
            .subscribe(() => {
                this.showTranslated.set(true);
            });
    }

    public getAnimationClass(type: AllAnimationClassType): string {
        return this.cssClasses[type];
    }
}
