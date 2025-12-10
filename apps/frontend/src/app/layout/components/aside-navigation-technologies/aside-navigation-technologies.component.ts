import { Observable, distinctUntilChanged, takeUntil } from 'rxjs';

import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    inject,
    input,
    output,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { THardSkillsNav } from '@core/models/hard-skills-nav.type';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { DestroyService } from '@core/service/destroy/destroy.service';

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
    providers: [DestroyService],
    templateUrl: './aside-navigation-technologies.component.html',
    styleUrls: [
        './aside-navigation-technologies.component.scss',
        './aside-navigation-technologies-dm/aside-navigation-technologies-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideNavigationTechnologiesComponent implements OnInit {
    public emittedMainTab = output<'technologies' | 'other'>();
    public emittedSubTab = output<'frontend' | 'backend'>();

    private _destroyed$ = inject(DestroyService);
    private _cdr = inject(ChangeDetectorRef);
    private _store$ = inject(Store);
    private _cacheStorageService = inject(CacheStorageService);

    public hardSkillsNavigation$: Observable<THardSkillsNav[]> =
        this._store$.pipe(select(selectHardSkillsNav), distinctUntilChanged());

    public theme = input<boolean | null>(false);
    public navigationList = input<TTechnologiesAside[]>([]);
    public currentSkills: string = '';
    public selectedTab: 'technologies' | 'other' = 'technologies';
    public previousSkills: string = '';

    public changeTab(tab: 'technologies' | 'other') {
        if (this.selectedTab === tab) {
            return;
        }

        this.selectedTab = tab;

        this._cacheStorageService
            .setSelectedMainTechnologiesTab(tab) // Исправлено: saveSelectedTechnologiesTab → setSelectedMainTechnologiesTab
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                console.log('Technologies tab saved successfully');

                this.emittedMainTab.emit(tab);

                if (this.selectedTab === 'technologies') {
                    this._cacheStorageService
                        .getSelectedSubTechnologiesTab() // Исправлено: getSelectedSubTechnologiesTabSync → getSelectedSubTechnologiesTab
                        .pipe(takeUntil(this._destroyed$))
                        .subscribe((savedSubTab: 'frontend' | 'backend') => {
                            console.log('Loading saved sub technology:', savedSubTab);

                            this.emittedSubTab.emit(savedSubTab);
                            this.previousSkills = savedSubTab;
                            this._cdr.detectChanges();
                        });
                } else {
                    this.previousSkills = tab;
                    this._cdr.detectChanges();
                }
            });
    }

    public tabForRoute(event: 'frontend' | 'backend') {
        if (this.previousSkills !== event) {
            this.emittedSubTab.emit(event);
            this.previousSkills = event;
        }
    }

    ngOnInit(): void {
        this._cacheStorageService
            .getSelectedMainTechnologiesTab() // Исправлено: getSelectedTechnologiesTab → getSelectedMainTechnologiesTab
            .pipe(takeUntil(this._destroyed$))
            .subscribe((tab: 'technologies' | 'other') => {
                if (this.selectedTab !== tab) {
                    this.selectedTab = tab;

                    this.hardSkillsNavigation$
                        .pipe(takeUntil(this._destroyed$))
                        .subscribe((skills: THardSkillsNav[]) => {
                            console.log('Hard skills loaded:', skills);
                            if (
                                skills.length > 0 &&
                                this.currentSkills !== skills[0].link
                            ) {
                                this.currentSkills = skills[0].link;
                                this.previousSkills = this.currentSkills;
                            }
                            this._cdr.detectChanges();
                        });

                    this.emittedMainTab.emit(tab);

                    if (tab === 'technologies') {
                        this._cacheStorageService
                            .getSelectedSubTechnologiesTab() // Исправлено: getSelectedSubTechnologiesTabSync → getSelectedSubTechnologiesTab
                            .pipe(takeUntil(this._destroyed$))
                            .subscribe((savedSubTab: 'frontend' | 'backend') => {
                                console.log('Loading saved sub technology:', savedSubTab);

                                this.emittedSubTab.emit(savedSubTab);
                                this.previousSkills = savedSubTab;
                                this._cdr.detectChanges();
                            });
                    } else {
                        this.previousSkills = tab;
                        this._cdr.detectChanges();
                    }
                }
            });
    }
}
