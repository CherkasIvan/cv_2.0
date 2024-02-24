import { Component, Input } from '@angular/core';

@Component({
    selector: 'cv-button',
    standalone: true,
    imports: [],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
})
export class ButtonComponent {
    @Input() public buttonText: string = '';
    @Input() public buttonHoverText: string = '';

    ngOnInit() {
        console.log(this.buttonText);
        console.log(this.buttonHoverText);
    }
}
