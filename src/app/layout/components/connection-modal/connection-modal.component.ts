import { Component, EventEmitter, Output, input } from '@angular/core';

@Component({
    selector: 'cv-connection-modal',
    standalone: true,
    imports: [],
    templateUrl: './connection-modal.component.html',
    styleUrl: './connection-modal.component.scss',
})
export class ConnectionModalComponent {
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
