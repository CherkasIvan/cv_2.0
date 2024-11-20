import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FirstTimeComponent } from '@layout/components/first-time/first-time.component';

import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
    selector: 'cv-auth',
    imports: [LoginFormComponent, FirstTimeComponent],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
    public isModalDialogVisible: boolean = false;

    public getModalInstance($event: boolean) {
        this.isModalDialogVisible = $event;
    }
}
