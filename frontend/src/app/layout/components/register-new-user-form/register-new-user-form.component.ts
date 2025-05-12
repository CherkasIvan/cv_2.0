import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cv-register-new-user-form',
    imports: [],
    standalone: true,
    templateUrl: './register-new-user-form.component.html',
    styleUrls: [
        './styles/register-new-user-form.component.css',
        './styles/register-new-user-form-dm.scss',
        './styles/register-new-user-form-mobile.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterNewUserFormComponent {}
