import { Observable, takeUntil } from 'rxjs';

import { AsyncPipe } from '@angular/common';
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
import { TTechnologies } from '@core/models/technologies.type';
import { ApiService } from '@core/service/api/api.service';
import { DestroyService } from '@core/service/destroy/destroy.service';
import { technologyCardFadeIn } from '@core/utils/animations/technology-card-fade-in.animation';
import { listAnimation } from '@core/utils/animations/translate-fade-out';

import { AsideNavigationTechnologiesComponent } from '@layout/components/aside-navigation-technologies/aside-navigation-technologies.component';

import { darkModeSelector } from '@store/dark-mode-store/dark-mode.selectors';
import { FirebaseActions } from '@store/firebase-store/firebase.actions';
import {
    selectBackendTech,
    selectFrontendTech,
    selectOtherTech,
    selectTechnologiesAside,
} from '@store/firebase-store/firebase.selectors';

import { TechnologyCardComponent } from './components/technology-card/technology-card.component';

@Component({
    selector: 'cv-technologies',
    standalone: true,
    imports: [
        AsideNavigationTechnologiesComponent,
        TechnologyCardComponent,
        AsyncPipe,
        EvenColumnDirective,
    ],
    templateUrl: './technologies.component.html',
    styleUrls: [
        './technologies.component.scss',
        './technologies-mobile/technologies-mobile.component.scss',
        './technologies-dm/technologies-dm.component.scss',
    ],
    providers: [DestroyService],
    animations: [technologyCardFadeIn, listAnimation],
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
        this._apiService.getBackendTech().subscribe((backendTech) => {
            this._store$.dispatch(
                FirebaseActions.getBackendTechSuccess({ backendTech }),
            );
        });

        this._apiService.getFrontendTech().subscribe((frontendTech) => {
            this._store$.dispatch(
                FirebaseActions.getFrontendTechSuccess({ frontendTech }),
            );
        });

        this._apiService.getOtherTech().subscribe((otherTech) => {
            this._store$.dispatch(
                FirebaseActions.getOtherTechSuccess({ otherTech }),
            );
        });
    }

    constructor(
        private _cdr: ChangeDetectorRef,
        private _apiService: ApiService,
        @Inject(Store) private _store$: Store<TTechnologies>,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
    ) {}

    ngOnInit(): void {
        this._store$.dispatch(
            FirebaseActions.getTechnologiesAside({ imgName: '' }),
        );

        this._technologiesDispatcher();
        this.technologiesSwitcher(this.selectedTab);
    }
}
