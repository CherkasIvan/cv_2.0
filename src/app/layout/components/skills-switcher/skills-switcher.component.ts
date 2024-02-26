import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'cv-skills-switcher',
    standalone: true,
    imports: [NgClass],
    templateUrl: './skills-switcher.component.html',
    styleUrl: './skills-switcher.component.scss',
})
export class SkillsSwitcherComponent implements OnInit {
    @Input() public skillsList: any = [];

    public currentSkills: string = '';

    constructor(private cdr: ChangeDetectorRef) {}

    public changeSkillsList(tab: string) {
        console.log(tab);
        this.currentSkills = tab;
        // this.emittedTab.emit(this.selectedTab);
        this.cdr.detectChanges();
    }
    ngOnInit(): void {
        this.currentSkills = this.skillsList[0].value;
    }
}
