import { Observable, Subject } from 'rxjs';

import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
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
import { RouterLinkActive } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { INavigation } from '@core/models/navigation.interface';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import { selectHardSkillsNav } from '@layout/store/firebase-store/firebase.selectors';

import { AsideNavigationSubtechnologiesComponent } from '../aside-navigation-subtechnologies/aside-navigation-subtechnologies.component';

@Component({
    selector: 'cv-aside-navigation-technologies',
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsideNavigationTechnologiesComponent implements OnInit, OnDestroy {
    @Output() public emittedTab = new EventEmitter<string>();

    public hardSkillsNavigation$: Observable<INavigation[]> = this._store$.pipe(
        select(selectHardSkillsNav),
    );

    public theme = input<boolean | null>(false);

    public navigationList: InputSignal<TTechnologiesAside[]> = input<
        TTechnologiesAside[]
    >([]);
    public currentSkills: string = '';
    public selectedTab: 'technologies' | 'other' = 'technologies';

    private _destroyed$: Subject<void> = new Subject();

    constructor(
        private cdr: ChangeDetectorRef,
        private _store$: Store<INavigation>,
        private _localStorageService: LocalStorageService,
    ) {}

    public changeTab(tab: 'technologies' | 'other') {
        this.selectedTab = tab;
        this._localStorageService.saveSelectedTechnologiesTab(tab);
        if (this.currentSkills && this.selectedTab === 'technologies') {
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

    public tabForRoute(event: any) {
        this.emittedTab.emit(event);
    }

    ngOnInit(): void {
        this.selectedTab =
            this._localStorageService.getSelectedTechnologiesTab();
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
