import { NgClass, NgSwitch } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
} from '@angular/core';

import { LearningExperienceComponent } from './learning-experience/learning-experience.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';

@Component({
    selector: 'cv-experience',
    standalone: true,
    imports: [
        LearningExperienceComponent,
        WorkExperienceComponent,
        NgClass,
        NgSwitch,
    ],
    templateUrl: './experience.component.html',
    styleUrl: './experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
    public selectedTab: string = 'work';

    constructor(private cdr: ChangeDetectorRef) {}

    public changeTab(tab: string) {
        console.log(tab);
        this.selectedTab = tab;
        this.cdr.detectChanges();
    }
}
