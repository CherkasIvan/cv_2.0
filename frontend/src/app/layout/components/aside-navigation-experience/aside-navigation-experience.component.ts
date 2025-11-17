import { Observable, takeUntil } from 'rxjs';

import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    input,
    output,
    signal,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { TExperienceAside } from '@core/models/experience-aside.type';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { DestroyService } from '@core/service/destroy/destroy.service';

import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import { selectHardSkillsNav } from '@layout/store/firebase-store/firebase.selectors';

import { TranslateModule } from '@ngx-translate/core';
import { THardSkillsNav } from '@core/models/hard-skills-nav.type';

@Component({
    selector: 'cv-aside-navigation-experience',
    standalone: true,
    imports: [NgClass, TranslateModule],
    providers: [DestroyService],
    templateUrl: './aside-navigation-experience.component.html',
    styleUrls: [
        './aside-navigation-experience.component.scss',
        './aside-navigation-experience-dm/aside-navigation-experience-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideNavigationExperienceComponent implements OnInit {
    public emittedTab = output<string>();

    public hardSkillsNavigation$: Observable<THardSkillsNav[]> = this._store$.pipe(
        select(selectHardSkillsNav),
    );
    public theme = input<boolean | null>(false);
    public navigationList = input<TExperienceAside[]>([]);

    public currentSkills = signal<string>('');
    public selectedTab = signal<'work' | 'education'>('work');

    constructor(
        private _cdr: ChangeDetectorRef,
        @Inject(Store) private _store$: Store<THardSkillsNav>,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
        private _cacheStorageService: CacheStorageService,
    ) {}

    public changeTab(tab: 'education' | 'work') {
        this.selectedTab.set(tab);
        this._cacheStorageService.saveSelectedTab(tab);
        this.emittedTab.emit(tab);
        this._cdr.detectChanges();
    }

    public changeSkillsList(tab: string) {
        this.currentSkills.set(tab);
        this.emittedTab.emit(tab);
        this._cdr.detectChanges();
    }

    ngOnInit(): void {
        this._cacheStorageService
            .getSelectedTab()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((tab) => {
                this.selectedTab.set(tab);
                this.emittedTab.emit(tab);
            });

        this._store$.dispatch(
            FirebaseActions.getHardSkillsNav({ imgName: '' }),
        );

        this.hardSkillsNavigation$
            .pipe(takeUntil(this._destroyed$))
            .subscribe((skills: THardSkillsNav[]) => {
                const skill = skills.find((skill) => skill.id === '1');
                if (skill) {
                    this.currentSkills.set(skill.link);
                    this._cdr.detectChanges();
                }
            });
    }
}
