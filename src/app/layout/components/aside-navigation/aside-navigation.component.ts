import { findIndex } from 'rxjs';

import { NgClass } from '@angular/common';
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

@Component({
    selector: 'cv-aside-navigation',
    standalone: true,
    imports: [NgClass, RouterLinkActive],
    templateUrl: './aside-navigation.component.html',
    styleUrl: './aside-navigation.component.scss',
})
export class AsideNavigationComponent implements OnInit {
    public navigationList = input<TExperienceAside[]>([]);
    @Output() public emittedTab = new EventEmitter<string>();
    public currentSkills: string = '';
    public hardSkillsNavigation: any = [
        { id: 1, link: 'front', value: 'Навыки стороны клиента' },
        { id: 2, link: 'back', value: 'Навыки стороны сервера' },
    ];
    public selectedTab: string = '';

    constructor(private cdr: ChangeDetectorRef) {}

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

    ngOnInit(): void {}
}
// this.navigationList[0].value