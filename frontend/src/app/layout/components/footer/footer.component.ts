import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { ButtonComponent } from '../button/button.component';
import { TSocialMedia } from '@core/models/social-media.type';

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
    public socialLinks$ = input.required<TSocialMedia[] | null>();
    public theme = input<boolean | null>();
}
