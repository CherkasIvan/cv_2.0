import { Observable } from 'rxjs';

import { AsyncPipe, NgSwitch } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { TExperienceAside } from '@core/models/experience-aside.type';
import { IWorkExperience } from '@core/models/work-experience.interface';

import { AsideNavigationComponent } from '@layout/components/aside-navigation/aside-navigation.component';
import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { IDarkMode } from '@layout/store/model/dark-mode.interface';

import { IEducationExperience } from '@app/core/models/education.interface';
import { FirebaseActions } from '@app/layout/store/firebase-store/firebase.actions';
import {
    selectEducation,
    selectExperienceAside,
    selectWorkExperience,
} from '@app/layout/store/firebase-store/firebase.selectors';

import { EducationExperienceComponent } from './education-experience/education-experience.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';

@Component({
    selector: 'cv-experience',
    standalone: true,
    imports: [
        EducationExperienceComponent,
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
    public experienceAside$: Observable<TExperienceAside[]> = this._store$.pipe(
        select(selectExperienceAside),
    );

    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    public workPlace$: Observable<IWorkExperience[]> = this._store$.pipe(
        select(selectWorkExperience),
    );
    public selectedTab: string = '';

    public educationPlace$: Observable<IEducationExperience[]> =
        this._store$.pipe(select(selectEducation));

    public switchTab($event: string) {
        this.selectedTab = $event;
    }

    constructor(
        private _store$: Store<
            | IDarkMode
            | IWorkExperience
            | IEducationExperience
            | TExperienceAside
        >,
    ) {
        this.selectedTab === ''
            ? (this.selectedTab = 'work')
            : this.selectedTab;
    }

    ngOnInit(): void {
        this._store$.dispatch(FirebaseActions.getExperienceAside());
        this._store$.dispatch(FirebaseActions.getWorkExperience());
        this._store$.dispatch(FirebaseActions.getEducationPlaces());
    }
}
