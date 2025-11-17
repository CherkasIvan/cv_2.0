import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    input,
} from '@angular/core';
import { TWorkExperience } from '@core/models/work-experience.type';

import { ExperienceCardComponent } from '@layout/pages/experience/experience-card/experience-card.component';

@Component({
    selector: 'cv-work-experience',
    standalone: true,
    imports: [ExperienceCardComponent, NgClass],
    templateUrl: './work-experience.component.html',
    styleUrl: './work-experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkExperienceComponent {
    @Input() experience: any;
    @Input() $index!: number;
    public selectedTabWork = input.required<string>();
    public workExperience$ = input.required<TWorkExperience[] | null>();
    public theme = input<boolean | null>();
}
