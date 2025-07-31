import { Observable, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    output,
    signal,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { INavigation } from '@core/models/navigation.interface';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { DestroyService } from '@core/service/destroy/destroy.service';

import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import { selectHardSkillsNav } from '@layout/store/firebase-store/firebase.selectors';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cv-aside-navigation-subtechnologies',
    standalone: true,
    imports: [NgClass, RouterLinkActive, AsyncPipe, TranslateModule],
    templateUrl: './aside-navigation-subtechnologies.component.html',
    providers: [DestroyService],
    styleUrls: [
        './aside-navigation-subtechnologies.component.scss',
        './aside-navigation-subtechnologies-dm/aside-navigation-subtechnologies-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideNavigationSubtechnologiesComponent implements OnInit {
    public hardSkillsNavigation$: Observable<INavigation[]> = this._store$.pipe(
        select(selectHardSkillsNav),
    );

    public emittedTab = output<string>();

    public currentSkills = signal<string>('');
    public selectedTab = signal<'frontend' | 'backend'>('frontend');

    constructor(
        private _cdr: ChangeDetectorRef,
        @Inject(Store) private _store$: Store<INavigation[]>,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
        private _cacheStorageService: CacheStorageService,
    ) {}

    public changeRoutNavigation(link: string): boolean {
        return this.currentSkills() === link;
    }

    ngOnInit() {
        this._cacheStorageService
            .getSelectedTechnologiesTab()
            .subscribe((techTab) => {
                if (techTab === 'technologies') {
                    this._cacheStorageService
                        .getSelectedSubTechnologiesTab()
                        .subscribe((subTab) => {
                            console.log(subTab);
                            this.selectedTab.set(subTab || 'frontend');
                            this.currentSkills.set(this.selectedTab());
                            this._store$.dispatch(
                                FirebaseActions.getHardSkillsNav({
                                    imgName: '',
                                }),
                            );
                            this.emittedTab.emit(this.selectedTab());
                        });
                }
            });
    }

    public changeSkillsList(tab: string) {
        console.log(tab);
        this.currentSkills.set(tab);
        this._cacheStorageService.saveSelectedSubTechnologiesTab(
            tab as 'frontend' | 'backend',
        );
        this.emittedTab.emit(this.currentSkills());
        this._cdr.detectChanges();
    }
}
