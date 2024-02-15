import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cv-spinner',
    standalone: true,
    imports: [],
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {}
