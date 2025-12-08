import { Observable, distinctUntilChanged, takeUntil } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    inject,
    signal,
} from '@angular/core';

import { Store } from '@ngrx/store';

import { EvenColumnDirective } from '@core/directives/even-column.directive';
import { TBackendTechnologies } from '@core/models/backend-technologies.type';
import { TFrontendTechnologies } from '@core/models/frontend-technologies.type';
import { TOtherTechnologies } from '@core/models/other-technologies.type';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { ApiService } from '@core/service/api/api.service';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { DestroyService } from '@core/service/destroy/destroy.service';

import { AsideNavigationTechnologiesComponent } from '@layout/components/aside-navigation-technologies/aside-navigation-technologies.component';
import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import * as FirebaseActions from '@layout/store/firebase-store/firebase.actions';
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
        EvenColumnDirective,
    ],
    templateUrl: './technologies.component.html',
    styleUrls: ['./technologies.component.scss'],
    providers: [DestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologiesComponent implements OnInit {
    public selectedMainTab = signal<'technologies' | 'other'>('technologies');
    public selectedSubTab = signal<'frontend' | 'backend'>('frontend');
    public previousTab = signal<string>('');

    private _destroyed$ = inject(DestroyService);
    private _cdr = inject(ChangeDetectorRef);
    private _store$ = inject(Store);
    private _cacheStorageService = inject(CacheStorageService);
    private _apiService = inject(ApiService);

    public technologiesAside$: Observable<TTechnologiesAside[]> =
        this._store$.select(selectTechnologiesAside);
    public currentTheme$: Observable<boolean> =
        this._store$.select(darkModeSelector);
    public currentTechnologiesStack = signal<
        (TBackendTechnologies | TFrontendTechnologies | TOtherTechnologies)[]
    >([]);

    public stackVersion = signal(0);

    public trackByTechnologyId = (
        index: number,
        technology:
            | TBackendTechnologies
            | TFrontendTechnologies
            | TOtherTechnologies,
    ): string => {
        return `${technology.id}-${this.stackVersion()}`;
    };

    public backendTech$: Observable<TBackendTechnologies[]> =
        this._store$.select(selectBackendTech, distinctUntilChanged());

    public otherTech$: Observable<TOtherTechnologies[]> = this._store$.select(
        selectOtherTech,
        distinctUntilChanged(),
    );

    public frontendTech$: Observable<TFrontendTechnologies[]> =
        this._store$.select(selectFrontendTech, distinctUntilChanged());

    public technologiesSwitcher(
        mainTab: 'technologies' | 'other',
        subTab?: 'frontend' | 'backend',
    ): void {
        const targetTab =
            mainTab === 'technologies'
                ? subTab || this.selectedSubTab()
                : mainTab;

        if (this.previousTab() === targetTab) {
            return;
        }

        this.previousTab.set(targetTab);

        this.currentTechnologiesStack.set([]);
        this.stackVersion.update((v) => v + 1);
        this._cdr.detectChanges();

        const techObservable$ = this.getTechObservable(targetTab);

        techObservable$.pipe(takeUntil(this._destroyed$)).subscribe((tech) => {
            if (tech && tech.length > 0) {
                if (this.currentTechnologiesStack().length === 0) {
                    setTimeout(() => {
                        this.currentTechnologiesStack.set(tech);
                        this._cdr.markForCheck();
                    }, 100);
                }
            }
        });
    }

    private getTechObservable(tab: string): Observable<any> {
        switch (tab) {
            case 'other':
                return this.otherTech$;
            case 'frontend':
                return this.frontendTech$;
            case 'backend':
                return this.backendTech$;
            default:
                return this.frontendTech$;
        }
    }

    public switchMainTab($event: 'technologies' | 'other'): void {
        if (this.selectedMainTab() === $event) {
            return;
        }
        this.selectedMainTab.set($event);
        this._cacheStorageService
            .setSelectedMainTechnologiesTab($event)
            .subscribe();
        this.technologiesSwitcher(
            this.selectedMainTab(),
            this.selectedSubTab(),
        );
    }

    public switchSubTab($event: 'frontend' | 'backend'): void {
        if (
            this.selectedSubTab() === $event &&
            this.selectedMainTab() === 'technologies'
        ) {
            return;
        }
        this.selectedSubTab.set($event);
        this._cacheStorageService
            .setSelectedSubTechnologiesTab($event)
            .subscribe();
        this.technologiesSwitcher('technologies', this.selectedSubTab());
    }

    private _technologiesDispatcher(): void {
        this._apiService.getBackendTech().subscribe((backendTech) => {
            this._store$.dispatch(
                FirebaseActions.loadBackendTechSuccess({
                    backendTech,
                    images: [],
                }),
            );
        });

        this._apiService.getFrontendTech().subscribe((frontendTech) => {
            this._store$.dispatch(
                FirebaseActions.loadFrontendTechSuccess({
                    frontendTech,
                    images: [],
                }),
            );
        });

        this._apiService.getOtherTech().subscribe((otherTech) => {
            this._store$.dispatch(
                FirebaseActions.loadOtherTechSuccess({ otherTech, images: [] }),
            );
        });
    }

    ngOnInit(): void {
        this._store$.dispatch(FirebaseActions.loadTechnologiesAside());

        this._store$.dispatch(FirebaseActions.loadHardSkillsNav());

        this._technologiesDispatcher();

        // Subscribe to main tab changes
        this._cacheStorageService
            .getSelectedMainTechnologiesTab()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((mainTab: 'technologies' | 'other') => {
                this.selectedMainTab.set(mainTab);

                if (mainTab === 'technologies') {
                    // Subscribe to sub tab changes
                    this._cacheStorageService
                        .getSelectedSubTechnologiesTab()
                        .pipe(takeUntil(this._destroyed$))
                        .subscribe((subTab: 'frontend' | 'backend') => {
                            this.selectedSubTab.set(subTab);
                            this.technologiesSwitcher(mainTab, subTab);
                        });
                } else {
                    this.technologiesSwitcher(mainTab);
                }
            });
    }
}
