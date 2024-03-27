import {
    ChangeDetectionStrategy,
    Component,
    Input,
    input,
} from '@angular/core';
import { IWorkExperience } from '@app/core/models/work-experience.interface';

import { ExperienceCardComponent } from '@layout/pages/experience/experience-card/experience-card.component';

@Component({
    selector: 'cv-learning-experience',
    standalone: true,
    imports: [ExperienceCardComponent],
    templateUrl: './learning-experience.component.html',
    styleUrl: './learning-experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningExperienceComponent {
    public selectedTabLearning = input<string>('');
    public learningExperience = input.required<IWorkExperience[] | null>()
}
