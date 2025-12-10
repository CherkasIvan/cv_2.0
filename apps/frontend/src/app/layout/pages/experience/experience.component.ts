import { Observable } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { TEducationExperience } from '@core/models/education-experience.type';
import { TExperienceAside } from '@core/models/experience-aside.type';
import { TWorkExperience } from '@core/models/work-experience.type';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import * as FirebaseActions from '@layout/store/firebase-store/firebase.actions';
import {
    selectEducation,
    selectExperienceAside,
    selectWorkExperience,
} from '@layout/store/firebase-store/firebase.selectors';
import { TDarkModeState } from '@layout/store/model/dark-mode-state.type';

import { AsideNavigationExperienceComponent } from '../../components/aside-navigation-experience/aside-navigation-experience.component';
import { EducationExperienceComponent } from './education-experience/education-experience.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';

@Component({
    selector: 'cv-experience',
    standalone: true,
    imports: [
        EducationExperienceComponent,
        WorkExperienceComponent,
        AsideNavigationExperienceComponent,
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

    public workPlace$: Observable<TWorkExperience[]> = this._store$.pipe(
        select(selectWorkExperience),
    );
    public selectedTab: string = 'work';

    public educationPlace$: Observable<TEducationExperience[]> =
        this._store$.pipe(select(selectEducation));

    public switchTab($event: string) {
        this.selectedTab = $event;
        this._cd.detectChanges();
    }

    constructor(
        private _store$: Store<TDarkModeState>, // Simplify the Store type
        private _cd: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.switchTab('work');
        this._store$.dispatch(FirebaseActions.loadExperienceAside());
        this._store$.dispatch(FirebaseActions.loadWorkExperience());
        this._store$.dispatch(FirebaseActions.loadEducationPlaces());
    }
}
