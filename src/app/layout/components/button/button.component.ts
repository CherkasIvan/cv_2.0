import { NgClass, NgStyle } from '@angular/common';
import { Component, ElementRef, ViewChild, input } from '@angular/core';

@Component({
    selector: 'cv-button',
    standalone: true,
    imports: [NgClass, NgStyle],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
})
export class ButtonComponent {
    @ViewChild('generalButton') generalButton!: ElementRef;
    public buttonType = input.required<string>();
    public buttonText = input.required<string>();
    public buttonHoverText = input.required<string>();
    public buttonTheme = input<boolean | null>();
    public isHovered = false;

    private _activePosition = {
        transform: ' translateY(-155px)',
    };

    onHover() {
        this.isHovered = true;
    }

    onLeave() {
        this.isHovered = false;
    }

    public setActivePosition() {
        if (this.buttonType().length > 11 && this.isHovered) {
            return this._activePosition;
        } else {
            return;
        }
    }
}
