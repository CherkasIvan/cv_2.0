import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IWorkExperience } from '@app/core/models/work-experience.interface';
import { ExperienceCardComponent } from '@app/layout/pages/experience/experience-card/experience-card.component';

@Component({
    selector: 'cv-work-experience',
    standalone: true,
    imports: [ExperienceCardComponent],
    templateUrl: './work-experience.component.html',
    styleUrl: './work-experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkExperienceComponent {
    @Input() public selectedTabWork: string = '';
    @Input() public workExperience$: IWorkExperience[] | null = [];
}
