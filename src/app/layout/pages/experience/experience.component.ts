import { Observable } from 'rxjs';

import { AsyncPipe, NgSwitch } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { IEducation } from '@core/models/education.interface';
import { TExperienceAside } from '@core/models/experience-aside.type';
import { IWorkExperience } from '@core/models/work-experience.interface';

import { AsideNavigationComponent } from '@layout/components/aside-navigation/aside-navigation.component';
import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { IDarkMode } from '@layout/store/model/dark-mode.interface';

import { FirebaseActions } from '@app/layout/store/firebase-store/firebase.actions';
import {
    selectEducation,
    selectWorkExperience,
} from '@app/layout/store/firebase-store/firebase.selectors';

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
export class ExperienceComponent implements OnInit {
    public experienceAside: TExperienceAside[] = [
        { id: 1, title: 'Опыт работы', value: 'work' },
        { id: 2, title: 'Образование', value: 'education' },
    ];

    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    public workPlace$: Observable<IWorkExperience[]> = this._store$.pipe(
        select(selectWorkExperience),
    );
    public selectedTab: string = '';

    public educationPlace$: Observable<IEducation[]> = this._store$.pipe(
        select(selectEducation),
    );

    public switchTab($event: string) {
        this.selectedTab = $event;
    }

    constructor(
        private _store$: Store<IDarkMode | IWorkExperience | IEducation>,
    ) {
        this.selectedTab === ''
            ? (this.selectedTab = 'work')
            : this.selectedTab;
    }

    ngOnInit(): void {
        this._store$.dispatch(FirebaseActions.getWorkExperience());
        this._store$.dispatch(FirebaseActions.getEducationPlaces());
    }
}
