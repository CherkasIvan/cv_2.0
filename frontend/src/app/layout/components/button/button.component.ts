import { Observable } from 'rxjs';

import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
    input,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { darkModeSelector } from '@store/dark-mode-store/dark-mode.selectors';
import { TDarkMode } from '@store/model/dark-mode.type';

@Component({
    selector: 'cv-button',
    standalone: true,
    imports: [NgClass],
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
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

    constructor(private _store$: Store<TDarkMode>) {}

    onHover() {
        this.isHovered = true;
    }

    onLeave() {
        this.isHovered = false;
    }
}
