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
    selector: 'cv-aside-navigation',
    standalone: true,
    imports: [NgClass],
    templateUrl: './aside-navigation.component.html',
    styleUrl: './aside-navigation.component.scss',
})
export class AsideNavigationComponent implements OnInit {
    @Input() public navigationList: any[] = [];
    @Output() public emittedTab = new EventEmitter<string>();
    public selectedTab: string = '';

    constructor(private cdr: ChangeDetectorRef) {}

    public changeTab(tab: string) {
        console.log(tab);
        this.selectedTab = tab;
        this.emittedTab.emit(this.selectedTab);
        this.cdr.detectChanges();
    }
    ngOnInit(): void {
        this.selectedTab = this.navigationList[0].value;
    }
}
