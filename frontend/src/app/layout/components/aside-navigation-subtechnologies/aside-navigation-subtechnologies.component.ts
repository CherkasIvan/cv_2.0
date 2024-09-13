import { Observable } from 'rxjs';
import { boltx } from 'web3modal/dist/providers/connectors';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Output,
    input,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { INavigation } from '@app/core/models/navigation.interface';
import { FirebaseActions } from '@app/layout/store/firebase-store/firebase.actions';
import { selectHardSkillsNav } from '@app/layout/store/firebase-store/firebase.selectors';

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
export class AsideNavigationSubtechnologiesComponent {
    public hardSkillsNavigation$: Observable<INavigation[]> = this._store$.pipe(
        select(selectHardSkillsNav),
    );
    @Output() public emittedTab = new EventEmitter<string>();

    public currentSkills: string = '';
    public selectedTab: string = 'tech';

    constructor(
        private _cdr: ChangeDetectorRef,
        private _store$: Store,
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
        this._store$.dispatch(
            FirebaseActions.getHardSkillsNav({ imgName: '' }),
        );
        this.changeSkillsList('front');
    }
}
