import { Observable, takeUntil } from 'rxjs';

import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    InputSignal,
    OnInit,
    Output,
    input,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { TExperienceAside } from '@core/models/experience-aside.type';
import { INavigation } from '@core/models/navigation.interface';
import { DestroyService } from '@core/service/destroy/destroy.service';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { TranslateModule } from '@ngx-translate/core';
import { FirebaseActions } from '@store/firebase-store/firebase.actions';
import { selectHardSkillsNav } from '@store/firebase-store/firebase.selectors';

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

    constructor(
        private _cdr: ChangeDetectorRef,
        @Inject(Store) private _store$: Store<INavigation>,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
        private _localStorageService: LocalStorageService,
    ) {}

    public changeTab(tab: 'education' | 'work') {
        this.selectedTab = tab;
        this._localStorageService.saveSelectedTab(tab);
        this.emittedTab.emit(this.selectedTab);
        this._cdr.detectChanges();
    }

    public changeSkillsList(tab: string) {
        this.currentSkills = tab;
        this.emittedTab.emit(this.currentSkills);
        this._cdr.detectChanges();
    }

    ngOnInit(): void {
        this.selectedTab = this._localStorageService.getSelectedTab();
        this._store$.dispatch(
            FirebaseActions.getHardSkillsNav({ imgName: '' }),
        );
        this.hardSkillsNavigation$
            .pipe(takeUntil(this._destroyed$))
            .subscribe((skills: INavigation[]) => {
                const skill = skills.find((skill) => skill.id === '1');
                if (skill) {
                    this.currentSkills = skill.link;
                    this._cdr.detectChanges();
                }
            });
        this.emittedTab.emit(this.selectedTab);
    }
}
