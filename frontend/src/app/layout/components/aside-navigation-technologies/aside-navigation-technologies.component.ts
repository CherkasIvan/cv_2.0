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

import { INavigation } from '@core/models/navigation.interface';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { DestroyService } from '@core/service/destroy/destroy.service';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { TranslateModule } from '@ngx-translate/core';
import { FirebaseActions } from '@store/firebase-store/firebase.actions';
import { selectHardSkillsNav } from '@store/firebase-store/firebase.selectors';

import { AsideNavigationSubtechnologiesComponent } from '../aside-navigation-subtechnologies/aside-navigation-subtechnologies.component';

@Component({
    selector: 'cv-aside-navigation-technologies',
    standalone: true,
    imports: [
        NgClass,
        AsideNavigationSubtechnologiesComponent,
        TranslateModule,
    ],
    providers: [DestroyService],
    templateUrl: './aside-navigation-technologies.component.html',
    styleUrls: [
        './styles/aside-navigation-technologies.component.scss',
        './styles/aside-navigation-technologies-dm.component.scss',
        './styles/aside-navigation-technologies-mobile.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideNavigationTechnologiesComponent implements OnInit {
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

    constructor(
        private cdr: ChangeDetectorRef,
        private _store$: Store<INavigation>,
        private _localStorageService: LocalStorageService,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
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

    public tabForRoute(event: string) {
        this.emittedTab.emit(event);
    }

    ngOnInit(): void {
        this.selectedTab =
            this._localStorageService.getSelectedTechnologiesTab();
        this._store$.dispatch(
            FirebaseActions.getHardSkillsNav({ imgName: '' }),
        );
        this.hardSkillsNavigation$
            .pipe(takeUntil(this._destroyed$))
            .subscribe((skills: INavigation[]) => {
                console.log(skills);
                const skill = skills.find((skill) => skill.id === '1');
                if (skill) {
                    this.currentSkills = skill.link;
                    this.cdr.detectChanges();
                }
            });
        this.emittedTab.emit(this.selectedTab);
    }
}
