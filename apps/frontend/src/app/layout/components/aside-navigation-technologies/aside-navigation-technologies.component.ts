import { distinctUntilChanged } from 'rxjs';

import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnInit,
    inject,
    input,
    output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Store, select } from '@ngrx/store';

import { THardSkillsNav } from '@core/models/hard-skills-nav.type';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';

import { selectHardSkillsNav } from '@layout/store/firebase-store/firebase.selectors';

import { TranslateModule } from '@ngx-translate/core';

import { AsideNavigationSubtechnologiesComponent } from '../aside-navigation-subtechnologies/aside-navigation-subtechnologies.component';

@Component({
    selector: 'cv-aside-navigation-technologies',
    standalone: true,
    imports: [
        NgClass,
        AsideNavigationSubtechnologiesComponent,
        TranslateModule,
    ],
    templateUrl: './aside-navigation-technologies.component.html',
    styleUrls: [
        './aside-navigation-technologies.component.scss',
        './aside-navigation-technologies-dm/aside-navigation-technologies-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideNavigationTechnologiesComponent implements OnInit {
    public readonly emittedMainTab = output<'technologies' | 'other'>();
    public readonly emittedSubTab = output<'frontend' | 'backend'>();

    private readonly _destroyRef = inject(DestroyRef);
    private readonly _cdr = inject(ChangeDetectorRef);
    private readonly _store = inject(Store);
    private readonly _cacheStorageService = inject(CacheStorageService);

    public readonly hardSkillsNavigation$ = this._store.pipe(
        select(selectHardSkillsNav),
        distinctUntilChanged(),
        takeUntilDestroyed(this._destroyRef),
    );

    public readonly theme = input<boolean | null>(false);
    public readonly navigationList = input<TTechnologiesAside[]>([]);

    protected _currentSkills: string = '';
    protected _selectedTab: 'technologies' | 'other' = 'technologies';
    protected _previousSkills: string = '';

    public changeTab(tab: 'technologies' | 'other'): void {
        if (this._selectedTab === tab) {
            return;
        }

        this._selectedTab = tab;

        this._cacheStorageService
            .setSelectedMainTechnologiesTab(tab)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                console.log('Technologies tab saved successfully');

                this.emittedMainTab.emit(tab);

                if (this._selectedTab === 'technologies') {
                    this._cacheStorageService
                        .getSelectedSubTechnologiesTab()
                        .pipe(takeUntilDestroyed(this._destroyRef))
                        .subscribe((savedSubTab: 'frontend' | 'backend') => {
                            console.log(
                                'Loading saved sub technology:',
                                savedSubTab,
                            );

                            this.emittedSubTab.emit(savedSubTab);
                            this._previousSkills = savedSubTab;
                            this._cdr.detectChanges();
                        });
                } else {
                    this._previousSkills = tab;
                    this._cdr.detectChanges();
                }
            });
    }

    public tabForRoute(event: 'frontend' | 'backend'): void {
        if (this._previousSkills !== event) {
            this.emittedSubTab.emit(event);
            this._previousSkills = event;
        }
    }

    public ngOnInit(): void {
        this._cacheStorageService
            .getSelectedMainTechnologiesTab()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((tab: 'technologies' | 'other') => {
                if (this._selectedTab !== tab) {
                    this._selectedTab = tab;

                    this.hardSkillsNavigation$
                        .pipe(takeUntilDestroyed(this._destroyRef))
                        .subscribe((skills: THardSkillsNav[]) => {
                            console.log('Hard skills loaded:', skills);
                            if (
                                skills.length > 0 &&
                                this._currentSkills !== skills[0].link
                            ) {
                                this._currentSkills = skills[0].link;
                                this._previousSkills = this._currentSkills;
                            }
                            this._cdr.detectChanges();
                        });

                    this.emittedMainTab.emit(tab);

                    if (tab === 'technologies') {
                        this._cacheStorageService
                            .getSelectedSubTechnologiesTab()
                            .pipe(takeUntilDestroyed(this._destroyRef))
                            .subscribe(
                                (savedSubTab: 'frontend' | 'backend') => {
                                    console.log(
                                        'Loading saved sub technology:',
                                        savedSubTab,
                                    );

                                    this.emittedSubTab.emit(savedSubTab);
                                    this._previousSkills = savedSubTab;
                                    this._cdr.detectChanges();
                                },
                            );
                    } else {
                        this._previousSkills = tab;
                        this._cdr.detectChanges();
                    }
                }
            });
    }
}
