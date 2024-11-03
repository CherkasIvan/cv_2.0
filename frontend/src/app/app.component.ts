import { Subject, takeUntil } from 'rxjs';

import {
    ApplicationRef,
    ChangeDetectionStrategy,
    Component,
    NgZone,
    OnDestroy,
    inject,
    ɵglobal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TranslationService } from '@core/service/translation/translation.service';

@Component({
    selector: 'cv-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy {
    title = 'cv_2.0';

    private _destroyed$: Subject<void> = new Subject();

    constructor(private translationService: TranslationService) {}

    ngOnInit(): void {
        // this.loadTranslations('en');
    }

    // loadTranslations(language: string): void {
    //     this.translationService
    //         .loadTranslations(language)
    //         .pipe(takeUntil(this._destroyed$))
    //         .subscribe((translations) => {
    //             this.translationService.setTranslations(language, translations);
    //         });
    // }
    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
