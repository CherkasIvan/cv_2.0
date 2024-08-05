import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { NgClass, NgSwitch } from '@angular/common';
import { ChangeDetectorRef, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { fadeInOutCards } from '@app/core/utils/animations/fade-in-out-cards';

import { IEducation } from '@core/models/education.interface';
import { IWorkExperience } from '@core/models/work-experience.interface';

@Component({
    selector: 'cv-experience-card',
    standalone: true,
    imports: [NgSwitch, NgClass, RouterLink],
    templateUrl: './experience-card.component.html',
    styleUrls: [
        './experience-card.component.scss',
        './experience-card-dm/experience-card-dm.component.scss',
    ],
    animations: [
      fadeInOutCards
    ],
})
export class ExperienceCardComponent {
    public experienceType = input.required<string>();
    public workDescription = input<IWorkExperience | IEducation | null>(null);
    public experienceDescription = input<IWorkExperience | IEducation | null>(
        null,
    );
    public experienceCardImgVisibility: boolean = false;
    public theme = input<boolean | null>();

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.experienceType = this.experienceType || 'work';
        this.workDescription = this.workDescription || null;
        this.experienceDescription = this.experienceDescription || null;

        // Обнаружение изменений
        this.cdr.detectChanges();
    }
}
