import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cv-work-experience',
    standalone: true,
    imports: [],
    templateUrl: './work-experience.component.html',
    styleUrl: './work-experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkExperienceComponent {}
