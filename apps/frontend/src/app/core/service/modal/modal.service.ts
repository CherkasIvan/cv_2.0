import { Injectable, ViewContainerRef } from '@angular/core';

import { LoginFormComponent } from '@layout/components/login-form/login-form.component';
import { LogoutDialogComponent } from '@layout/components/logout-form/logout-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor(private viewContainerRef: ViewContainerRef) {}

    public openLoginForm() {
        this.viewContainerRef.createComponent(LoginFormComponent);
    }

    public openLogoutForm() {
        this.viewContainerRef.createComponent(LogoutDialogComponent);
    }
}
