import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IExperience } from '@core/models/experience.interface';

import { ExperienceDialogComponent } from '@layout/components/experience-dialog/experience-dialog.component';
import { ExperienceCardComponent } from '@layout/pages/experience/experience-card/experience-card.component';

@Component({
    selector: 'cv-education-experience',
    standalone: true,
    imports: [ExperienceCardComponent, ExperienceDialogComponent],
    templateUrl: './education-experience.component.html',
    styleUrl: './education-experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationExperienceComponent {
    public selectedTabEducation = input<string>('');
    public educationExperience$ = input.required<IExperience[] | null>();
    public theme = input<boolean | null>();
}
