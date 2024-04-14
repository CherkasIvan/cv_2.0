import { Component, EventEmitter, Output, input } from '@angular/core';

@Component({
    selector: 'cv-login-modal',
    standalone: true,
    imports: [],
    templateUrl: './login-modal.component.html',
    styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent {
    public header = input.required<string>();
    @Output() public emittedModalHide = new EventEmitter<boolean>();

    public confirmModalDialog() {
        this.emittedModalHide.emit(false);
    }

    public closeModalDialog() {
        this.emittedModalHide.emit(false);
    }

    public resetModalDialog() {
        this.emittedModalHide.emit(false);
    }
}
