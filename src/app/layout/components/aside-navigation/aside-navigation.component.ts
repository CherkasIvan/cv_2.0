import { Observable, find, findIndex } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    computed,
    input,
    signal,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { TExperienceAside } from '@app/core/models/experience-aside.type';
import { INavigation } from '@app/core/models/navigation.interface';
import { FirebaseService } from '@app/core/service/firebase/firebase.service';

@Component({
    selector: 'cv-aside-navigation',
    standalone: true,
    imports: [NgClass, RouterLinkActive, AsyncPipe],
    templateUrl: './aside-navigation.component.html',
    styleUrl: './aside-navigation.component.scss',
})
export class AsideNavigationComponent implements OnInit {
    public navigationList = input<TExperienceAside[]>([]);
    @Output() public emittedTab = new EventEmitter<string>();
    public currentSkills: string = '';
    public hardSkillsNavigation$: Observable<INavigation[]> =
        this._firebaseService.getHardSkillsNav();
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

    public changeSkillsList(tab: string, event: Event) {
        event.stopPropagation();
        this.currentSkills = tab;
        this.emittedTab.emit(this.currentSkills);
        this.cdr.detectChanges();
    }

    ngOnInit(): void {
        this.selectedTab === '' ? this._tab() : this.selectedTab;
        this.selectedTab === 'tech'
            ? this.hardSkillsNavigation$.subscribe((skills) => {
                  skills.find((skill) => {
                      skill.id === '1';
                      return (this.currentSkills = skill.link);
                  });
              })
            : null;
        this.emittedTab.emit(this.currentSkills);
    }
}
// this.navigationList[0].value
