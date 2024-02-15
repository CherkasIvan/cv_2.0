import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cv-experience',
    standalone: true,
    imports: [],
    templateUrl: './experience.component.html',
    styleUrl: './experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {}
