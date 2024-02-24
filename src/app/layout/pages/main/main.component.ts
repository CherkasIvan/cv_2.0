import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ButtonComponent } from '@layout/components/button/button.component';

@Component({
    selector: 'cv-main',
    standalone: true,
    imports: [ButtonComponent],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {}
