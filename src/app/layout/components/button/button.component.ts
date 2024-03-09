import { NgClass } from '@angular/common';
import { Component, Input, input, signal } from '@angular/core';

@Component({
    selector: 'cv-button',
    standalone: true,
    imports: [NgClass],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
})
export class ButtonComponent {
    public buttonText = input.required<string>();
    public buttonHoverText = input.required<string>();
    public isHovered = false;

    onHover() {
        this.isHovered = true;
    }

    onLeave() {
        this.isHovered = false;
    }

    ngOnInit() {
        console.log(this.buttonText);
        console.log(this.buttonHoverText);
    }
}
