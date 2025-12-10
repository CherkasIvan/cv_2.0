import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnInit,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, distinctUntilChanged, of, switchMap } from 'rxjs';

import { EvenColumnDirective } from '@core/directives/even-column.directive';
import { TBackendTechnologies } from '@core/models/backend-technologies.type';
import { TFrontendTechnologies } from '@core/models/frontend-technologies.type';
import { TOtherTechnologies } from '@core/models/other-technologies.type';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { ApiService } from '@core/service/api/api.service';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { AsideNavigationTechnologiesComponent } from '@layout/components/aside-navigation-technologies/aside-navigation-technologies.component';
import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import * as FirebaseActions from '@layout/store/firebase-store/firebase.actions';
import {
    selectBackendTech,
    selectFrontendTech,
    selectOtherTech,
    selectTechnologiesAside,
} from '@layout/store/firebase-store/firebase.selectors';
import { Store } from '@ngrx/store';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologiesComponent implements OnInit {
    public selectedMainTab = signal<'technologies' | 'other'>('technologies');
    public selectedSubTab = signal<'frontend' | 'backend'>('frontend');
    public previousTab = signal<string>('');

    private destroyRef = inject(DestroyRef);
    private cdr = inject(ChangeDetectorRef);
    private store = inject(Store);
    private cacheStorageService = inject(CacheStorageService);
    private apiService = inject(ApiService);

    public technologiesAside$: Observable<TTechnologiesAside[]> =
        this.store.select(selectTechnologiesAside);
    public currentTheme$: Observable<boolean> =
        this.store.select(darkModeSelector);
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

    public backendTech$: Observable<TBackendTechnologies[]> = this.store.select(
        selectBackendTech,
        distinctUntilChanged(),
    );

    public otherTech$: Observable<TOtherTechnologies[]> = this.store.select(
        selectOtherTech,
        distinctUntilChanged(),
    );

    public frontendTech$: Observable<TFrontendTechnologies[]> =
        this.store.select(selectFrontendTech, distinctUntilChanged());

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
        this.cdr.detectChanges();

        const techObservable$ = this.getTechObservable(targetTab);

        techObservable$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((tech) => {
                if (tech?.length > 0) {
                    if (this.currentTechnologiesStack().length === 0) {
                        setTimeout(() => {
                            this.currentTechnologiesStack.set(tech);
                            this.cdr.markForCheck();
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
        this.cacheStorageService
            .setSelectedMainTechnologiesTab($event)
            .pipe(takeUntilDestroyed(this.destroyRef))
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
        this.cacheStorageService
            .setSelectedSubTechnologiesTab($event)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        this.technologiesSwitcher('technologies', this.selectedSubTab());
    }

    private technologiesDispatcher(): void {
        this.apiService
            .getBackendTech()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((backendTech) => {
                this.store.dispatch(
                    FirebaseActions.loadBackendTechSuccess({
                        backendTech,
                        images: [],
                    }),
                );
            });

        this.apiService
            .getFrontendTech()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((frontendTech) => {
                this.store.dispatch(
                    FirebaseActions.loadFrontendTechSuccess({
                        frontendTech,
                        images: [],
                    }),
                );
            });

        this.apiService
            .getOtherTech()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((otherTech) => {
                this.store.dispatch(
                    FirebaseActions.loadOtherTechSuccess({
                        otherTech,
                        images: [],
                    }),
                );
            });
    }

    ngOnInit(): void {
        this.store.dispatch(FirebaseActions.loadTechnologiesAside());
        this.store.dispatch(FirebaseActions.loadHardSkillsNav());

        this.technologiesDispatcher();

        // Subscribe to main tab changes with proper cleanup
        this.cacheStorageService
            .getSelectedMainTechnologiesTab()
            .pipe(
                switchMap((mainTab: 'technologies' | 'other') => {
                    this.selectedMainTab.set(mainTab);

                    if (mainTab === 'technologies') {
                        // Subscribe to sub tab changes
                        return this.cacheStorageService
                            .getSelectedSubTechnologiesTab()
                            .pipe(
                                switchMap((subTab: 'frontend' | 'backend') => {
                                    this.selectedSubTab.set(subTab);
                                    this.technologiesSwitcher(mainTab, subTab);
                                    return of(null);
                                }),
                                takeUntilDestroyed(this.destroyRef),
                            );
                    } else {
                        this.technologiesSwitcher(mainTab);
                        return of(null);
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }
}
