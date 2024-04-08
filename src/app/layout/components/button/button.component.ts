import { NgClass, NgStyle } from '@angular/common';
import {
    Component,
    ElementRef,
    Input,
    ViewChild,
    computed,
    input,
    signal,
} from '@angular/core';

@Component({
    selector: 'cv-button',
    standalone: true,
    imports: [NgClass, NgStyle],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
})
export class ButtonComponent {
    @ViewChild('generalButton') generalButton!: ElementRef;
    public buttonText = input.required<string>();
    public buttonHoverText = input.required<string>();
    public isHovered = false;

    private _watchCv = {
        width: '200px',
        height: '200px',
        left: '-150px',
    };

    private _connectWithMe = {
        width: '250px',
        height: '250px',
        left: '-200px',
    };

    private _activePosition = {
        transform: ' translateY(-155px)',
    };

    // private _inactivePosition = {
    //   transform: 'translateY(-130px)';
    // }

    constructor(private el: ElementRef) {}

    onHover() {
        this.isHovered = true;
    }

    onLeave() {
        this.isHovered = false;
    }

    public setActivePosition() {
        if (this.buttonText().length > 11 && this.isHovered) {
            return this._activePosition;
        } else {
            return;
        }
    }

    public setAbsoluteWidth() {
        return this.buttonText().length > 11
            ? this._connectWithMe
            : this._watchCv;
    }
}
