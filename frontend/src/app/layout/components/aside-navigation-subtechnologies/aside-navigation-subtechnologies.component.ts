import { Observable } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnInit,
    Output,
    input,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { INavigation } from '@core/models/navigation.interface';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import { selectHardSkillsNav } from '@layout/store/firebase-store/firebase.selectors';

@Component({
    selector: 'cv-aside-navigation-subtechnologies',
    standalone: true,
    imports: [NgClass, RouterLinkActive, AsyncPipe],
    templateUrl: './aside-navigation-subtechnologies.component.html',
    styleUrls: [
        './aside-navigation-subtechnologies.component.scss',
        './aside-navigation-subtechnologies-dm/aside-navigation-subtechnologies-dm.component.scss',
    ],
})
export class AsideNavigationSubtechnologiesComponent implements OnInit {
    public hardSkillsNavigation$: Observable<INavigation[]> = this._store$.pipe(
        select(selectHardSkillsNav),
    );
    @Output() public emittedTab = new EventEmitter<string>();

    public currentSkills: string = '';
    public selectedTab: 'frontend' | 'backend' = 'frontend';

    constructor(
        private _cdr: ChangeDetectorRef,
        private _store$: Store,
        private _localStorageService: LocalStorageService,
    ) {}

    public changeRoutNavigation(link: string): boolean {
        return this.currentSkills === link;
    }

    public changeSkillsList(tab: string) {
        this.currentSkills = tab;
        this.emittedTab.emit(this.currentSkills);
        this._cdr.detectChanges();
    }

    ngOnInit() {
        this.selectedTab =
            this._localStorageService.getSelectedSubTechnologiesTab();
        this._store$.dispatch(
            FirebaseActions.getHardSkillsNav({ imgName: '' }),
        );
        this.hardSkillsNavigation$.subscribe((skills: INavigation[]) => {
            const skill = skills.find((skill) => skill.id === '1');
            if (skill) {
                this.currentSkills = skill.link;
                this._cdr.detectChanges();
            }
        });
        this.emittedTab.emit(this.selectedTab);
    }
}
