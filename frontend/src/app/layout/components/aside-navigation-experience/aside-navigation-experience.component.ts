import { Observable, Subject } from 'rxjs';

import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    InputSignal,
    OnDestroy,
    OnInit,
    Output,
    input,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { TExperienceAside } from '@core/models/experience-aside.type';
import { INavigation } from '@core/models/navigation.interface';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import { selectHardSkillsNav } from '@layout/store/firebase-store/firebase.selectors';

@Component({
    selector: 'cv-aside-navigation-experience',
    imports: [NgClass],
    templateUrl: './aside-navigation-experience.component.html',
    styleUrls: [
        './aside-navigation-experience.component.scss',
        './aside-navigation-experience-dm/aside-navigation-experience-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideNavigationExperienceComponent implements OnInit, OnDestroy {
    @Output() public emittedTab = new EventEmitter<string>();

    public hardSkillsNavigation$: Observable<INavigation[]> = this._store$.pipe(
        select(selectHardSkillsNav),
    );

    public theme = input<boolean | null>(false);

    public navigationList: InputSignal<TExperienceAside[]> = input<
        TExperienceAside[]
    >([]);
    public currentSkills: string = '';
    public selectedTab: 'work' | 'education' = 'work';

    private _destroyed$: Subject<void> = new Subject();

    constructor(
        private cdr: ChangeDetectorRef,
        private _store$: Store<INavigation>,
        private _localStorageService: LocalStorageService,
    ) {}

    public changeTab(tab: 'education' | 'work') {
        this.selectedTab = tab;
        this._localStorageService.saveSelectedTab(tab);
        if (this.currentSkills && this.selectedTab === 'work') {
            this.emittedTab.emit(this.currentSkills);
        } else {
            this.emittedTab.emit(this.selectedTab);
        }
        this.cdr.detectChanges();
    }

    public changeSkillsList(tab: string) {
        this.currentSkills = tab;
        this.emittedTab.emit(this.currentSkills);
        this.cdr.detectChanges();
    }

    ngOnInit(): void {
        this.selectedTab = this._localStorageService.getSelectedTab();
        this._store$.dispatch(
            FirebaseActions.getHardSkillsNav({ imgName: '' }),
        );
        this.hardSkillsNavigation$.subscribe((skills: INavigation[]) => {
            const skill = skills.find((skill) => skill.id === '1');
            if (skill) {
                this.currentSkills = skill.link;
                this.cdr.detectChanges();
            }
        });
        this.emittedTab.emit(this.selectedTab);
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
