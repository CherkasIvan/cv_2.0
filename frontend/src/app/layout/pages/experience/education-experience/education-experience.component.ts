import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    input,
} from '@angular/core';
import { TEducationExperience } from '@core/models/education-experience.type';
import { TWorkExperience } from '@core/models/work-experience.type';


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
    public educationExperience$ = input.required<TEducationExperience[] | TWorkExperience[] | null>();
    public theme = input<boolean | null>();
}
