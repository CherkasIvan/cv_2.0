import { Observable } from 'rxjs';

import { AsyncPipe, NgSwitch } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IEducation } from '@core/models/education.interface';
import { TExperienceAside } from '@core/models/experience-aside.type';
import { IWorkExperience } from '@core/models/work-experience.interface';
import { FirebaseService } from '@core/service/firebase/firebase.service';

import { AsideNavigationComponent } from '@layout/components/aside-navigation/aside-navigation.component';

import { educationComponent } from './adduction/education.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';

@Component({
    selector: 'cv-experience',
    standalone: true,
    imports: [
        educationComponent,
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
    public experienceAside: TExperienceAside[] = [
        { id: 1, title: 'Опыт работы', value: 'work' },
        { id: 2, title: 'Образование', value: 'education' },
    ];

    public workPlace$: Observable<IWorkExperience[]> =
        this._firebaseService.getWorkExperience();
    public selectedTab: string = '';

    public educationPlace$: Observable<IEducation[]> =
        this._firebaseService.getEducationPlaces();

    public switchTab($event: string) {
        this.selectedTab = $event;
    }

    constructor(private _firebaseService: FirebaseService) {
        this.selectedTab === ''
            ? (this.selectedTab = 'work')
            : this.selectedTab;
    }
}
