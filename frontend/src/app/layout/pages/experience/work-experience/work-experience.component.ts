import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IWorkExperience } from '@core/models/work-experience.interface';

import { ExperienceDialogComponent } from '@layout/components/experience-dialog/experience-dialog.component';
import { ExperienceCardComponent } from '@layout/pages/experience/experience-card/experience-card.component';

@Component({
    selector: 'cv-work-experience',
    standalone: true,
    imports: [ExperienceCardComponent, ExperienceDialogComponent],
    templateUrl: './work-experience.component.html',
    styleUrl: './work-experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkExperienceComponent {
    public selectedTabWork = input.required<string>();
    public workExperience$ = input.required<IWorkExperience[] | null>();
    public theme = input<boolean | null>();
}
