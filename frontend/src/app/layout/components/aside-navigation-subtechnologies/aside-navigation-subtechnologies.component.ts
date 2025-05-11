import { Observable } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    OnInit,
    Output,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { INavigation } from '@core/models/navigation.interface';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { TranslateModule } from '@ngx-translate/core';
import { FirebaseActions } from '@store/firebase-store/firebase.actions';
import { selectHardSkillsNav } from '@store/firebase-store/firebase.selectors';

@Component({
    selector: 'cv-aside-navigation-subtechnologies',
    standalone: true,
    imports: [NgClass, RouterLinkActive, AsyncPipe, TranslateModule],
    templateUrl: './aside-navigation-subtechnologies.component.html',
    styleUrls: [
        './aside-navigation-subtechnologies.component.scss',
        './aside-navigation-subtechnologies-dm/aside-navigation-subtechnologies-dm.component.scss',
        './aside-navigation-subtechnologies-mobile/aside-navigation-subtechnologies-mobile.component.scss',
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
        @Inject(Store) private _store$: Store<INavigation[]>,
        private _localStorageService: LocalStorageService,
    ) {}

    public changeRoutNavigation(link: string): boolean {
        return this.currentSkills === link;
    }

    ngOnInit() {
        this.selectedTab =
            this._localStorageService.getSelectedSubTechnologiesTab();
        if (
            this._localStorageService.getSelectedTechnologiesTab() ===
            'technologies'
        ) {
            this.currentSkills =
                this._localStorageService.getSelectedSubTechnologiesTab() ||
                'frontend';
            this._localStorageService.saveSelectedSubTechnologiesTab(
                this.currentSkills as 'frontend' | 'backend',
            );
        }
        this._store$.dispatch(
            FirebaseActions.getHardSkillsNav({ imgName: '' }),
        );
        this.emittedTab.emit(this.selectedTab);
    }

    public changeSkillsList(tab: string) {
        this.currentSkills = tab;
        this._localStorageService.saveSelectedSubTechnologiesTab(
            tab as 'frontend' | 'backend',
        );
        this.emittedTab.emit(this.currentSkills);
        this._cdr.detectChanges();
    }
}
