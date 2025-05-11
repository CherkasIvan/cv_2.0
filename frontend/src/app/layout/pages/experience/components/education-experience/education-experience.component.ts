import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    input,
} from '@angular/core';

import { IExperience } from '@core/models/experience.interface';

import { ExperienceCardComponent } from '@layout/pages/experience/components/experience-card/experience-card.component';

@Component({
    selector: 'cv-education-experience',
    standalone: true,
    imports: [ExperienceCardComponent, NgClass],
    templateUrl: './education-experience.component.html',
    styleUrls: [
        './education-experience.component.scss',
        './education-experience-dm/education-experience-dm.component.scss',
        './education-experience-mobile/education-experience-mobile.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationExperienceComponent {
    @Input() experience: any;
    @Input() $index!: number;
    public selectedTabEducation = input<string>('');
    public educationExperience$ = input.required<IExperience[] | null>();
    public theme = input<boolean | null>();
}
