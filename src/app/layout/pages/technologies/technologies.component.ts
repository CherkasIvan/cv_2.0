import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cv-technologies',
    standalone: true,
    imports: [],
    templateUrl: './technologies.component.html',
    styleUrl: './technologies.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologiesComponent {}
