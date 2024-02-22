import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cv-learning-experience',
    standalone: true,
    imports: [],
    templateUrl: './learning-experience.component.html',
    styleUrl: './learning-experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningExperienceComponent {}
