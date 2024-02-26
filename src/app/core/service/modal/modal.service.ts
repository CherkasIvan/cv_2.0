import { Injectable, ViewContainerRef } from '@angular/core';

import { LoginModalComponent } from '@layout/components/login-modal/login-modal.component';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor(private viewContainerRef: ViewContainerRef) {}

    public openLoginModal() {
        const modalComponent =
            this.viewContainerRef.createComponent(LoginModalComponent);
    }
}
