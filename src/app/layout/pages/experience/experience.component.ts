import { NgSwitch } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AsideNavigationComponent } from '@layout/components/aside-navigation/aside-navigation.component';

import { LearningExperienceComponent } from './learning-experience/learning-experience.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';

@Component({
    selector: 'cv-experience',
    standalone: true,
    imports: [
        LearningExperienceComponent,
        WorkExperienceComponent,
        NgSwitch,
        AsideNavigationComponent,
    ],
    templateUrl: './experience.component.html',
    styleUrl: './experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
    public experienceAside: any = [
        { id: 1, title: 'Опыт работы', value: 'work' },
        { id: 2, title: 'Образование', value: 'learning' },
    ];
    public selectedTab: string = '';

    public switchTab($event: string) {
        console.log(this.selectedTab);
        console.log($event);
        this.selectedTab = $event;
    }
}
