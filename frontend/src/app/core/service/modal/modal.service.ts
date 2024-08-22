import { Injectable, ViewContainerRef } from '@angular/core';

import { LoginFormComponent } from '@layout/components/login-form/login-form.component';
import { LogoutFormComponent } from '@layout/components/logout-form/logout-form.component';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor(private viewContainerRef: ViewContainerRef) {}

    public openLoginForm() {
        this.viewContainerRef.createComponent(LoginFormComponent);
    }

    public openLogoutForm() {
        this.viewContainerRef.createComponent(LogoutFormComponent);
    }
}
