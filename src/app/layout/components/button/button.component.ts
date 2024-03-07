import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'cv-button',
    standalone: true,
    imports: [NgClass],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
})
export class ButtonComponent {
    @Input() public buttonText: string = '';
    @Input() public buttonHoverText: string = '';
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
