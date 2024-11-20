import { Observable } from 'rxjs';

import { AsyncPipe, NgSwitch } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { IEducationExperience } from '@core/models/education.interface';
import { TExperienceAside } from '@core/models/experience-aside.type';
import { IWorkExperience } from '@core/models/work-experience.interface';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import {
    selectEducation,
    selectExperienceAside,
    selectWorkExperience,
} from '@layout/store/firebase-store/firebase.selectors';
import { IDarkMode } from '@layout/store/model/dark-mode.interface';

import { AsideNavigationExperienceComponent } from '../../components/aside-navigation-experience/aside-navigation-experience.component';
import { EducationExperienceComponent } from './education-experience/education-experience.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';

@Component({
    selector: 'cv-experience',
    imports: [
        EducationExperienceComponent,
        WorkExperienceComponent,
        NgSwitch,
        AsideNavigationExperienceComponent,
        AsyncPipe,
    ],
    templateUrl: './experience.component.html',
    styleUrl: './experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
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
        this._cd.detectChanges();
    }

    constructor(
        private _store$: Store<
            | IDarkMode
            | IWorkExperience
            | IEducationExperience
            | TExperienceAside
        >,
        private _cd: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.switchTab('work');
        this._store$.dispatch(
            FirebaseActions.getExperienceAside({ imgName: '' }),
        );
        this._store$.dispatch(
            FirebaseActions.getWorkExperience({ imgName: 'companies-logo' }),
        );
        this._store$.dispatch(
            FirebaseActions.getEducationPlaces({ imgName: 'certificates' }),
        );
    }
}
