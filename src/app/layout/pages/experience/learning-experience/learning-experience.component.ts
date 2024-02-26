import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ExperienceCardComponent } from '@layout/components/experience-card/experience-card.component';

@Component({
    selector: 'cv-learning-experience',
    standalone: true,
    imports: [ExperienceCardComponent],
    templateUrl: './learning-experience.component.html',
    styleUrl: './learning-experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningExperienceComponent {
    @Input() public selectedTabLearning: string = '';
}
