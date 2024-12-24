import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    input,
} from '@angular/core';

import { IExperience } from '@core/models/experience.interface';

import { ExperienceDialogComponent } from '@layout/components/experience-dialog/experience-dialog.component';
import { ExperienceCardComponent } from '@layout/pages/experience/experience-card/experience-card.component';

@Component({
    selector: 'cv-education-experience',
    standalone: true,
    imports: [ExperienceCardComponent, NgClass],
    templateUrl: './education-experience.component.html',
    styleUrl: './education-experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationExperienceComponent {
    @Input() experience: any;
    @Input() $index!: number;
    public selectedTabEducation = input<string>('');
    public educationExperience$ = input.required<IExperience[] | null>();
    public theme = input<boolean | null>();
}
