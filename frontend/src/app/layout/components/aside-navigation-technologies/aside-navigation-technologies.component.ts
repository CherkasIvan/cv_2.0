import { Observable, takeUntil, distinctUntilChanged } from 'rxjs';

import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    input,
    output,
    OnInit,
} from '@angular/core';

import { select, Store } from '@ngrx/store';

import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { DestroyService } from '@core/service/destroy/destroy.service';

import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import { selectHardSkillsNav } from '@layout/store/firebase-store/firebase.selectors';

import { TranslateModule } from '@ngx-translate/core';

import { AsideNavigationSubtechnologiesComponent } from '../aside-navigation-subtechnologies/aside-navigation-subtechnologies.component';
import { THardSkillsNav } from '@core/models/hard-skills-nav.type';

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

    public hardSkillsNavigation$: Observable<THardSkillsNav[]> = this._store$.pipe(
        select(selectHardSkillsNav),
        distinctUntilChanged()
    );

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
        
        this._cacheStorageService.saveSelectedTechnologiesTab(tab)
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                console.log('Technologies tab saved successfully');
                
                // Эмитим основную вкладку
                this.emittedMainTab.emit(tab);
                
                if (this.selectedTab === 'technologies') {
                    const savedSubTab = this._cacheStorageService.getSelectedSubTechnologiesTabSync();
                    console.log('Loading saved sub technology:', savedSubTab);
                    
                    // Эмитим сохраненную субвкладку
                    this.emittedSubTab.emit(savedSubTab);
                    this.previousSkills = savedSubTab;
                } else {
                    this.previousSkills = tab;
                }
                this._cdr.detectChanges();
            });
    }

    // Этот метод получает события от дочернего компонента
    public tabForRoute(event: 'frontend' | 'backend') {
        if (this.previousSkills !== event) {
            // Эмитим субтаб дальше в родительский компонент
            this.emittedSubTab.emit(event);
            this.previousSkills = event;
        }
    }

    ngOnInit(): void {
        this._cacheStorageService
            .getSelectedTechnologiesTab()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((tab: 'technologies' | 'other') => {
                if (this.selectedTab !== tab) {
                    this.selectedTab = tab;
                    this._store$.dispatch(
                        FirebaseActions.getHardSkillsNav({ imgName: '' }),
                    );

                    this.hardSkillsNavigation$
                        .pipe(takeUntil(this._destroyed$))
                        .subscribe((skills: THardSkillsNav[]) => {
                            const skill = skills.find((skill) => skill.id === '1');
                            if (skill && this.currentSkills !== skill.link) {
                                this.currentSkills = skill.link;
                                this.previousSkills = this.currentSkills;
                            }
                            this._cdr.detectChanges();
                        });

                    // Эмитим события при инициализации
                    this.emittedMainTab.emit(tab);
                    
                    if (tab === 'technologies') {
                        const savedSubTab = this._cacheStorageService.getSelectedSubTechnologiesTabSync();
                        this.emittedSubTab.emit(savedSubTab);
                        this.previousSkills = savedSubTab;
                    } else {
                        this.previousSkills = tab;
                    }
                    
                    this._cdr.detectChanges();
                }
            });
    }
}