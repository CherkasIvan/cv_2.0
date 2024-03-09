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
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'cv-skills-switcher',
    standalone: true,
    imports: [NgClass, RouterLink, RouterLinkActive],
    templateUrl: './skills-switcher.component.html',
    styleUrl: './skills-switcher.component.scss',
})
export class SkillsSwitcherComponent implements OnInit {
    public skillsList = input.required<[]>();
    public currentTab = input.required<string>();
    @Output() public emittedCurrentTab = new EventEmitter<string>();

    public currentSkills: string = '';

    constructor(private cdr: ChangeDetectorRef) {
        this.currentSkills = computed(() =>
            this.skillsList().find((el: any) => el.id === 1),
        );
    }

    public changeSkillsList(tab: string, event: Event) {
        console.log(tab);
        event.stopPropagation();
        this.currentSkills = tab;
        this.emittedCurrentTab.emit(tab);
        this.cdr.detectChanges();
    }
    ngOnInit(): void {
        console.log(this.currentTab);

        this.emittedCurrentTab.emit(this.currentSkills);
        console.log(this.currentSkills);
    }
}
