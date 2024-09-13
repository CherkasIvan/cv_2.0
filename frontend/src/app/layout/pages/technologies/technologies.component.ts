import { Observable } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { EvenColumnDirective } from '@core/directives/even-column.directive';
import { TExperienceAside } from '@core/models/experience-aside.type';
import { ITechnologies } from '@core/models/technologies.interface';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { IDarkMode } from '@layout/store/model/dark-mode.interface';

import { AsideNavigationTechnologiesComponent } from '@app/layout/components/aside-navigation-technologies/aside-navigation-technologies.component';
import { FirebaseActions } from '@app/layout/store/firebase-store/firebase.actions';
import {
    selectBackendTech,
    selectFrontendTech,
    selectOtherTech,
    selectTechnologiesAside,
} from '@app/layout/store/firebase-store/firebase.selectors';

import { TechnologyCardComponent } from './components/technology-card/technology-card.component';

@Component({
    selector: 'cv-technologies',
    standalone: true,
    imports: [
        AsideNavigationTechnologiesComponent,
        TechnologyCardComponent,
        AsyncPipe,
        NgClass,
        EvenColumnDirective,
    ],
    templateUrl: './technologies.component.html',
    styleUrl: './technologies.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologiesComponent implements OnInit {
    public selectedTab: string = '';

    data: ITechnologies[] | undefined;

    public technologiesAside$: Observable<TExperienceAside[]> =
        this._store$.pipe(select(selectTechnologiesAside));

    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    public currentTechnologiesStack: ITechnologies[] = [];

    public backendTech$: Observable<ITechnologies[]> = this._store$.pipe(
        select(selectBackendTech),
    );

    public otherTech$: Observable<ITechnologies[]> = this._store$.pipe(
        select(selectOtherTech),
    );

    public frontendTech$: Observable<ITechnologies[]> = this._store$.pipe(
        select(selectFrontendTech),
    );

    public technologiesSwitcher(tab: string): void {
        switch (tab) {
            case 'other':
                this.otherTech$.subscribe((tech) => {
                    if (tech) {
                        this.currentTechnologiesStack = tech;
                        this._cdr.markForCheck();
                    }
                });
                break;
            case 'front':
                this.frontendTech$.subscribe((tech) => {
                    if (tech) {
                        this.currentTechnologiesStack = tech;
                        this._cdr.markForCheck();
                    }
                });
                break;
            case 'back':
                this.backendTech$.subscribe((tech) => {
                    if (tech) {
                        this.currentTechnologiesStack = tech;
                        this._cdr.markForCheck();
                    }
                });
                break;
        }
    }

    public switchTab($event: string) {
        this.selectedTab = $event;
        this.technologiesSwitcher(this.selectedTab);
    }

    private _technologiesDispatcher() {
        this._store$.dispatch(
            FirebaseActions.getTechnologiesAside({ imgName: '' }),
        );
        this._store$.dispatch(
            FirebaseActions.getBackendTech({
                imgName: 'technologies/backend',
            }),
        );
        this._store$.dispatch(
            FirebaseActions.getFrontendTech({
                imgName: 'technologies/frontend',
            }),
        );
        this._store$.dispatch(
            FirebaseActions.getOtherTech({
                imgName: 'technologies/other',
            }),
        );
    }

    constructor(
        private _cdr: ChangeDetectorRef,
        private _store$: Store<IDarkMode>,
    ) {}

    ngOnInit(): void {
        this._technologiesDispatcher();
        this.technologiesSwitcher(this.selectedTab);
    }
}
