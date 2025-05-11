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
    selector: 'cv-work-experience',
    standalone: true,
    imports: [ExperienceCardComponent, NgClass],
    templateUrl: './work-experience.component.html',
    styleUrls: [
        './work-experience.component.scss',
        './work-experience-mobile/work-experience-mobile.component.scss',
        './work-experience-dm/work-experience-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkExperienceComponent {
    @Input() experience: any;
    @Input() $index!: number;
    public selectedTabWork = input.required<string>();
    public workExperience$ = input.required<IExperience[] | null>();
    public theme = input<boolean | null>();
}
