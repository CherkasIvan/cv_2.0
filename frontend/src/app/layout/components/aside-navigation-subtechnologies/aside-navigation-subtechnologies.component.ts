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
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';

import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import { selectHardSkillsNav } from '@layout/store/firebase-store/firebase.selectors';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cv-aside-navigation-subtechnologies',
    standalone: true,
    imports: [NgClass, RouterLinkActive, AsyncPipe, TranslateModule],
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
        @Inject(Store) private _store$: Store<INavigation[]>,
        private _cacheStorageService: CacheStorageService,
    ) {}

    public changeRoutNavigation(link: string): boolean {
        return this.currentSkills === link;
    }

    ngOnInit() {
        this.selectedTab =
            this._cacheStorageService.getSelectedSubTechnologiesTab();
        if (
            this._cacheStorageService.getSelectedTechnologiesTab() ===
            'technologies'
        ) {
            this.currentSkills =
                this._cacheStorageService.getSelectedSubTechnologiesTab() ||
                'frontend';
            this._cacheStorageService.saveSelectedSubTechnologiesTab(
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
        this._cacheStorageService.saveSelectedSubTechnologiesTab(
            tab as 'frontend' | 'backend',
        );
        this.emittedTab.emit(this.currentSkills);
        this._cdr.detectChanges();
    }
}
