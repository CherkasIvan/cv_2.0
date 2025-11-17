import { Observable, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    output,
    signal,
    OnInit,
    computed,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { DestroyService } from '@core/service/destroy/destroy.service';

import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import { selectHardSkillsNav } from '@layout/store/firebase-store/firebase.selectors';

import { TranslateModule } from '@ngx-translate/core';
import { THardSkillsNav } from '@core/models/hard-skills-nav.type';

@Component({
    selector: 'cv-aside-navigation-subtechnologies',
    standalone: true,
    imports: [NgClass, RouterLinkActive, AsyncPipe, TranslateModule],
    templateUrl: './aside-navigation-subtechnologies.component.html',
    providers: [DestroyService],
    styleUrls: [
        './aside-navigation-subtechnologies.component.scss',
        './aside-navigation-subtechnologies-dm/aside-navigation-subtechnologies-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideNavigationSubtechnologiesComponent implements OnInit {
    private _destroyed$ = inject(DestroyService);
    private _cdr = inject(ChangeDetectorRef);
    private _store$ = inject(Store);
    private _cacheStorageService = inject(CacheStorageService);

    // Инициализируем после inject()
    public hardSkillsNavigation$: Observable<THardSkillsNav[]> = this._store$.pipe(
        select(selectHardSkillsNav),
    );

    public emittedTab = output<'frontend' | 'backend'>();

    public currentSkills = signal<string>('');
    public selectedTab = signal<'frontend' | 'backend'>('frontend');

    // Вспомогательная computed для проверки активной ссылки
    public isActiveLink = computed(() => (link: string) => {
        return this.currentSkills() === link;
    });

    ngOnInit() {
        this._cacheStorageService
            .getSelectedTechnologiesTab()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((techTab: 'technologies' | 'other') => {
                if (techTab === 'technologies') {
                    const savedTab = this._cacheStorageService.getSelectedSubTechnologiesTabSync();
                    console.log('Restoring sub technology:', savedTab);
                    
                    this.selectedTab.set(savedTab);
                    this.currentSkills.set(savedTab);
                    this._store$.dispatch(
                        FirebaseActions.getHardSkillsNav({ imgName: '' }),
                    );
                    
                    if (this.currentSkills() !== savedTab) {
                        this.emittedTab.emit(savedTab);
                    }
                }
            });
    }

    public changeSkillsList(tab: 'frontend' | 'backend') {
        console.log('Changing skills to:', tab);
        
        this.currentSkills.set(tab);
        
        this._cacheStorageService.saveSelectedSubTechnologiesTab(tab)
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                console.log('Sub technology tab saved successfully');
                
                if (this.selectedTab() !== tab) {
                    this.selectedTab.set(tab);
                    this.emittedTab.emit(tab);
                }
                
                this._cdr.detectChanges();
            });
    }
}