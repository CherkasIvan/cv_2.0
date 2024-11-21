import { Observable } from 'rxjs';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Store } from '@ngrx/store';

import { ISocialMedia } from '@core/models/social-media.interface';

import { LanguageState } from '@layout/store/language-selector-store/language-selector.reducers';
import { languageSelector } from '@layout/store/language-selector-store/language-selector.selectors';

import { TranslateService } from '@ngx-translate/core';

import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'cv-footer',
    imports: [ButtonComponent, NgClass],
    templateUrl: './footer.component.html',
    styleUrls: [
        './footer.component.scss',
        './footer-dm/footer-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
    public socialLinks$ = input.required<ISocialMedia[] | null>();
    public theme = input<boolean | null>();

    public language$!: Observable<'ru' | 'en'>;

    constructor(
        private translate: TranslateService,
        private store: Store<LanguageState>,
    ) {
        this.store.select(languageSelector).subscribe((language) => {
            this.translate.use(language);
        });
    }

    ngOnInit(): void {
        this.language$ = this.store.select(languageSelector);
    }
}
