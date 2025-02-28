import { Observable } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { TExperienceAside } from '@core/models/experience-aside.type';
import { IExperience } from '@core/models/experience.interface';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import {
    selectEducation,
    selectExperienceAside,
    selectWorkExperience,
} from '@layout/store/firebase-store/firebase.selectors';
import { TDarkMode } from '@layout/store/model/dark-mode.type';

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

    public workPlace$: Observable<IExperience[]> = this._store$.pipe(
        select(selectWorkExperience),
    );
    public selectedTab: string = 'work';

    public educationPlace$: Observable<IExperience[]> = this._store$.pipe(
        select(selectEducation),
    );

    public switchTab($event: string) {
        this.selectedTab = $event;
        this._cd.detectChanges();
    }

    constructor(
        private _store$: Store<
            TDarkMode | IExperience | IExperience | TExperienceAside
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
