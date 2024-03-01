import { NgClass, NgSwitch } from '@angular/common';
import { Component, Input } from '@angular/core';

import { IWorkExperience } from '@app/core/models/work-experience.interface';

@Component({
    selector: 'cv-experience-card',
    standalone: true,
    imports: [NgSwitch, NgClass],
    templateUrl: './experience-card.component.html',
    styleUrl: './experience-card.component.scss',
})
export class ExperienceCardComponent {
    @Input() public experienceType: string = 'work';
    @Input() public workDescription: IWorkExperience | null = null;

    constructor() {}

    ngOnInit() {
        console.log(this.workDescription);
    }
}
