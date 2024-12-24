import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ISocialMedia } from '@core/models/social-media.interface';

import { TranslateModule } from '@ngx-translate/core';

import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'cv-footer',
    standalone: true,
    imports: [TranslateModule, ButtonComponent, NgClass],
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
}
