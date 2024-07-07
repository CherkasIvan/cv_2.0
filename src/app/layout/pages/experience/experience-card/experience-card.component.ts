import { NgClass, NgSwitch } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IEducation } from '@core/models/education.interface';
import { IWorkExperience } from '@core/models/work-experience.interface';

@Component({
    selector: 'cv-experience-card',
    standalone: true,
    imports: [NgSwitch, NgClass, RouterLink],
    templateUrl: './experience-card.component.html',
    styleUrl: './experience-card.component.scss',
})
export class ExperienceCardComponent {
    public experienceType = input.required<string>();
    public workDescription = input<IWorkExperience | IEducation | null>(null);
    public experienceDescription = input<IWorkExperience | IEducation | null>(
        null,
    );
    public experienceCardImgVisibility: boolean = false;

    constructor() {}
}
