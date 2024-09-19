import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
    selector: 'cv-auth',
    standalone: true,
    imports: [LoginFormComponent],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
    public isModalDialogVisible: boolean = false;

    public getModalInstance($event: boolean) {
        this.isModalDialogVisible = $event;
    }
}
