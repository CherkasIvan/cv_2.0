import { timer } from 'rxjs';

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AuthService } from '@core/service/auth/auth.service';
import { listAnimation } from '@core/utils/animations/translate-fade-out';

@Component({
    selector: 'cv-first-time',
    standalone: true,
    animations: [listAnimation],
    templateUrl: './first-time.component.html',
    styleUrls: ['./first-time.component.scss'],
})
export class FirstTimeComponent implements OnInit {
    public isAuth = false;
    public showTranslated = false;
    public persons = [
        {
            name: 'Черкас Иван (SEO) Fullstack разработчик',
            translated: 'Cherkas Ivan (SEO) Fullstack Developer',
        },
        {
            name: 'Зябликов Александр (DevOPS)',
            translated: 'Zyablikov Alexander (DevOPS)',
        },
        {
            name: 'Подобед Дарья (UI/UX дизайнер)',
            translated: 'Podobed Darya (UI/UX Designer)',
        },
    ];

    public titles = [
        {
            name: 'Это приложение CV было сделано усилиями трех человек:',
            translated:
                'This CV application was made by the efforts of three people:',
        },
        {
            name: 'Так же спасибо огромное моей семье, которая на всех этапах разработки меня всегда поддерживала и мотивировала.',
            translated:
                'Also, a huge thank you to my family, who always supported and motivated me at all stages of the development.',
        },
    ];

    constructor(
        private _authService: AuthService,
        private _cd: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.isAuth = this._authService.isAuth$.getValue();
        timer(6000).subscribe(() => {
            this.showTranslated = true;
            this._cd.markForCheck();
        });
    }
}
