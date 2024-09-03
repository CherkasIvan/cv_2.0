import { Observable } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    InputSignal,
    OnChanges,
    OnInit,
    Output,
    computed,
    input,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { TExperienceAside } from '@core/models/experience-aside.type';
import { INavigation } from '@core/models/navigation.interface';

import { FirebaseActions } from '@app/layout/store/firebase-store/firebase.actions';
import { selectHardSkillsNav } from '@app/layout/store/firebase-store/firebase.selectors';

@Component({
    selector: 'cv-aside-navigation',
    standalone: true,
    imports: [NgClass, RouterLinkActive, AsyncPipe],
    templateUrl: './aside-navigation.component.html',
    styleUrls: [
        './aside-navigation.component.scss',
        './aside-navigation-dm/aside-navigation-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideNavigationComponent implements OnChanges {
    @Output() public emittedTab = new EventEmitter<string>();

    public hardSkillsNavigation$: Observable<INavigation[]> = this._store$.pipe(
        select(selectHardSkillsNav),
    );

    public theme = input<boolean | null>(false);

    public navigationList: InputSignal<TExperienceAside[]> = input<
        TExperienceAside[]
    >([]);
    public currentSkills: string = '';
    public selectedTab: string = '';

    constructor(
        private cdr: ChangeDetectorRef,
        private _store$: Store<INavigation>,
    ) {}

    public changeTab(tab: string) {
        this.selectedTab = tab;
        if (this.currentSkills && this.selectedTab === 'tech') {
            this.emittedTab.emit(this.currentSkills);
        } else {
            this.emittedTab.emit(this.selectedTab);
        }
        this.cdr.detectChanges();
    }

    private _tab = computed(() => {
        this.navigationList().find((el: any) => {
            if (el.id === '1') {
                this.selectedTab = el.value;
            }
        });
    });

    public changeSkillsList(tab: string) {
        this.currentSkills = tab;
        this.emittedTab.emit(this.currentSkills);
        this.cdr.detectChanges();
    }

    ngOnChanges(): void {
        console.log(this.navigationList());
        if (this.navigationList().length) {
            this._store$.dispatch(
                FirebaseActions.getHardSkillsNav({ imgName: '' }),
            );

            this.selectedTab === '' ? this._tab() : this.selectedTab;
            this.selectedTab === 'tech'
                ? this.hardSkillsNavigation$.subscribe(
                      (skills: INavigation[]) => {
                          skills.find((skill) => {
                              if (skill.id === '1') {
                                  this.currentSkills = skill.link;
                                  console.log(this.currentSkills);
                                  this.changeSkillsList(skill.link);
                              }
                          });
                      },
                  )
                : null;
            this.cdr.detectChanges();
            this.emittedTab.emit(this.currentSkills);
        }
    }
}
