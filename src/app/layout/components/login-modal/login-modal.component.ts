import { Subject } from 'rxjs';

import { Component, input } from '@angular/core';

import {
    ModalDialogBase,
    ModalDialogResult,
} from '@core/enum/modal-dialog.base.enum';

@Component({
    selector: 'cv-login-modal',
    standalone: true,
    imports: [],
    templateUrl: './login-modal.component.html',
    styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent extends ModalDialogBase {
    public header = input.required<string>();
    public description = input.required<string>();
    private modalState: Subject<ModalDialogResult>;

    constructor() {
        super();
        this.modalState = new Subject();
    }

    public getDialogState(): Subject<ModalDialogResult> {
        return this.modalState;
    }

    public confirm() {
        this.modalState.next(ModalDialogResult.Confirmed);
    }

    public close() {
        this.modalState.next(ModalDialogResult.Closed);
    }
}
