import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'cv-dark-mode-toggle',
    standalone: true,
    imports: [NgClass],
    templateUrl: './dark-mode-toggle.component.html',
    styleUrl: './dark-mode-toggle.component.scss',
})
export class DarkModeToggleComponent {
    public isChecked$: boolean = false;

    public changeView(): void {
        this.isChecked$ = !this.isChecked$;
    }
}
