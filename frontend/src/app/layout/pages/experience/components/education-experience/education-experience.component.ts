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
        './styles/education-experience.component.scss',
        './styles/education-experience-dm.component.scss',
        './styles/education-experience-mobile.component.scss',
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
