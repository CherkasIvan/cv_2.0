import { Observable, Subject, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { EvenColumnDirective } from '@core/directives/even-column.directive';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { ITechnologies } from '@core/models/technologies.interface';
import { TTechnologies } from '@core/models/tecnologies.type';

import { AsideNavigationTechnologiesComponent } from '@layout/components/aside-navigation-technologies/aside-navigation-technologies.component';
import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import {
    selectBackendTech,
    selectFrontendTech,
    selectOtherTech,
    selectTechnologiesAside,
} from '@layout/store/firebase-store/firebase.selectors';

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

    public data: ITechnologies[] | undefined;

    public technologiesAside$: Observable<TTechnologiesAside[]> =
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

    private _destroyed$: Subject<void> = new Subject();

    public technologiesSwitcher(tab: string): void {
        switch (tab) {
            case 'other':
                this.otherTech$
                    .pipe(takeUntil(this._destroyed$))
                    .subscribe((tech) => {
                        if (tech) {
                            this.currentTechnologiesStack = tech;
                            this._cdr.markForCheck();
                        }
                    });
                break;
            case 'frontend':
                this.frontendTech$
                    .pipe(takeUntil(this._destroyed$))
                    .subscribe((tech) => {
                        if (tech) {
                            this.currentTechnologiesStack = tech;
                            this._cdr.markForCheck();
                        }
                    });
                break;
            case 'backend':
                this.backendTech$
                    .pipe(takeUntil(this._destroyed$))
                    .subscribe((tech) => {
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
        @Inject(Store) private _store$: Store<TTechnologies>,
    ) {}

    ngOnInit(): void {
        this._technologiesDispatcher();
        this.technologiesSwitcher(this.selectedTab);
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
