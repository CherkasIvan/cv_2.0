import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@layout/components/button/button.component';

import { ProfileLogoComponent } from '../../../layout/components/profile-logo/profile-logo.component';

@Component({
    selector: 'cv-main',
    standalone: true,
    imports: [ButtonComponent, ProfileLogoComponent, RouterLink],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {}
