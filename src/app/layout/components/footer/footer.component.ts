import { Observable } from 'rxjs';

import { NgFor } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    input,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ISocialMedia } from '@core/models/social-media.interface';

import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'cv-footer',
    standalone: true,
    imports: [RouterLink, NgFor, RouterLinkActive, ButtonComponent],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
    public socialLinks$ = input.required<ISocialMedia[] | null>();
}
