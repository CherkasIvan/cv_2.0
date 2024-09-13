import { Observable } from 'rxjs';

import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
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

import { AsideNavigationSubtechnologiesComponent } from '../aside-navigation-subtechnologies/aside-navigation-subtechnologies.component';

@Component({
    selector: 'cv-aside-navigation-technologies',
    standalone: true,
    imports: [
        NgClass,
        RouterLinkActive,
        AsyncPipe,
        JsonPipe,
        AsideNavigationSubtechnologiesComponent,
    ],
    templateUrl: './aside-navigation-technologies.component.html',
    styleUrls: [
        './aside-navigation-technologies.component.scss',
        './aside-navigation-technologies-dm/aside-navigation-technologies-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideNavigationTechnologiesComponent implements OnChanges {
    @Output() public emittedTab = new EventEmitter<string>();

    public hardSkillsNavigation$: Observable<INavigation[]> = this._store$.pipe(
        select(selectHardSkillsNav),
    );

    public theme = input<boolean | null>(false);

    public navigationList: InputSignal<TExperienceAside[]> = input<
        TExperienceAside[]
    >([]);
    public currentSkills: string = '';
    public selectedTab: string = 'tech';

    constructor(
        private cdr: ChangeDetectorRef,
        private _store$: Store<INavigation>,
    ) {}

    public tabForRoute(event: any) {
        this.emittedTab.emit(event);
    }

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
        if (this.navigationList().length) {
            this._store$.dispatch(
                FirebaseActions.getHardSkillsNav({ imgName: '' }),
            );

            this.selectedTab === '' ? this._tab() : this.selectedTab;
            if (this.selectedTab === 'tech') {
                this.hardSkillsNavigation$.subscribe(
                    (skills: INavigation[]) => {
                        const skill = skills.find((skill) => skill.id === '1');
                        if (skill) {
                            this.currentSkills = skill.link;
                            this.changeSkillsList(skill.link);
                        }
                    },
                );
            }
            this.cdr.detectChanges();
            this.emittedTab.emit(this.currentSkills);
        }
    }

    ngOnInit(): void {
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
    }
}
