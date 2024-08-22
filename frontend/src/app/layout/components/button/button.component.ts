import { Observable } from 'rxjs';

import { NgClass, NgStyle } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
    input,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { IDarkMode } from '@layout/store/model/dark-mode.interface';

@Component({
    selector: 'cv-button',
    standalone: true,
    imports: [NgClass, NgStyle],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
    @ViewChild('generalButton') generalButton!: ElementRef;
    public buttonType = input.required<string>();
    public buttonText = input.required<string>();
    public buttonHoverText = input.required<string>();
    public buttonTheme = input<boolean | null>();
    public isHovered = false;
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    constructor(private _store$: Store<IDarkMode>) {}

    onHover() {
        this.isHovered = true;
    }

    onLeave() {
        this.isHovered = false;
    }
}
