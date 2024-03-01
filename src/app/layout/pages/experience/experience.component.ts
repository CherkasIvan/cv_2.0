import { Observable } from 'rxjs';

import { AsyncPipe, NgSwitch } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AsideNavigationComponent } from '@layout/components/aside-navigation/aside-navigation.component';

import { IWorkExperience } from '@app/core/models/work-experience.interface';
import { FirebaseService } from '@app/core/service/firebase/firebase.service';

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
        AsyncPipe,
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

    public workPlace$: Observable<IWorkExperience[]> =
        this._firebaseService.getWorkExperience();
    public selectedTab: string = '';

    public switchTab($event: string) {
        this.selectedTab = $event;
    }

    constructor(private _firebaseService: FirebaseService) {}
}
