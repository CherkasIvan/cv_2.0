import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IEducation } from '@core/models/education.interface';

import { ExperienceCardComponent } from '@layout/pages/experience/experience-card/experience-card.component';

@Component({
    selector: 'cv-education',
    standalone: true,
    imports: [ExperienceCardComponent, JsonPipe],
    templateUrl: './education.component.html',
    styleUrl: './education.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class educationComponent {
    public selectedTabEducation = input<string>('');
    public educationExperience = input.required<IEducation[] | null>();
    public theme = input<boolean | null>();
}
