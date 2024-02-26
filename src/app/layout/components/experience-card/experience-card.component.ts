import { NgClass, NgSwitch } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'cv-experience-card',
    standalone: true,
    imports: [NgSwitch, NgClass],
    templateUrl: './experience-card.component.html',
    styleUrl: './experience-card.component.scss',
})
export class ExperienceCardComponent {
    @Input() public experienceType: string = 'work';
}
