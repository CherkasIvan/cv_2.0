import { Observable } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    InputSignal,
    OnInit,
    Output,
    computed,
    input,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { INavigation } from '@core/models/navigation.interface';
import { FirebaseService } from '@core/service/firebase/firebase.service';

import { TExperienceAside } from '@app/core/models/experience-aside.type';

@Component({
    selector: 'cv-aside-navigation',
    standalone: true,
    imports: [NgClass, RouterLinkActive, AsyncPipe],
    templateUrl: './aside-navigation.component.html',
    styleUrl: './aside-navigation.component.scss',
})
export class AsideNavigationComponent implements OnInit {
    @Output() public emittedTab = new EventEmitter<string>();

    public hardSkillsNavigation$: Observable<INavigation[]> =
        this._firebaseService.getHardSkillsNav();

    public navigationList: InputSignal<TExperienceAside[]> = input<
        TExperienceAside[]
    >([]);
    public currentSkills: string = '';
    public selectedTab: string = '';

    constructor(
        private cdr: ChangeDetectorRef,
        private _firebaseService: FirebaseService,
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
            if (el.id === 1) {
                this.selectedTab = el.value;
            }
        });
    });

    public changeSkillsList(tab: string) {
        this.currentSkills = tab;
        this.emittedTab.emit(this.currentSkills);
        this.cdr.detectChanges();
    }

    ngOnInit(): void {
        this.selectedTab === '' ? this._tab() : this.selectedTab;
        this.selectedTab === 'tech'
            ? this.hardSkillsNavigation$.subscribe((skills: INavigation[]) => {
                  skills.find((skill) => {
                      if (skill.id === '1') {
                          this.currentSkills = skill.link;
                          this.changeSkillsList(skill.link);
                      }
                  });
              })
            : null;
        this.emittedTab.emit(this.currentSkills);
    }
}
// this.navigationList[0].value
