import { NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
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
    @Input() public skillsList: any = [];
    @Input() public currentTab: string = '';
    @Output() public emittedCurrentTab = new EventEmitter<string>();

    public currentSkills: string = '';

    constructor(private cdr: ChangeDetectorRef) {}

    public changeSkillsList(tab: string, event: Event) {
        console.log(tab);
        event.stopPropagation();
        this.currentSkills = tab;
        this.emittedCurrentTab.emit(tab);
        this.cdr.detectChanges();
    }
    ngOnInit(): void {
        console.log(this.currentTab);
        this.currentSkills = this.skillsList[0].link;
        this.emittedCurrentTab.emit(this.currentSkills);
        console.log(this.currentSkills);
    }
}
