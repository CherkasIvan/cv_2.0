import { NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';

@Component({
    selector: 'cv-skills-switcher',
    standalone: true,
    imports: [NgClass],
    templateUrl: './skills-switcher.component.html',
    styleUrl: './skills-switcher.component.scss',
})
export class SkillsSwitcherComponent implements OnInit {
    @Input() public skillsList: any = [];
    @Output() public emittedCurrentTab = new EventEmitter<string>();

    public currentSkills: string = '';

    constructor(private cdr: ChangeDetectorRef) {}

    public changeSkillsList(tab: string) {
        console.log(tab);
        this.currentSkills = tab;
        this.emittedCurrentTab.emit(tab);
        this.cdr.detectChanges();
    }
    ngOnInit(): void {
        this.currentSkills = this.skillsList[0].value;
    }
}
