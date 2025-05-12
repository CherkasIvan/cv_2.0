import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ISocialMedia } from '@core/models/social-media.interface';

import { TranslateModule } from '@ngx-translate/core';

import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'cv-footer',
    standalone: true,
    imports: [TranslateModule, ButtonComponent, NgClass],
    templateUrl: './footer.component.html',
    styleUrls: [
        './styles/footer.component.scss',
        './styles/footer-dm.component.scss',
        './styles/footer-mobile.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
    public socialLinks$ = input.required<ISocialMedia[] | null>();
    public theme = input<boolean | null>();
}
