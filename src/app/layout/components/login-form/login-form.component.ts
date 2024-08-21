import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    ViewChild,
    input,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { Store } from '@ngrx/store';

import { AuthActions } from '@layout/store/auth-store/auth.actions';
import { TProfile } from '@layout/store/model/profile.type';

@Component({
    selector: 'cv-login-form',
    standalone: true,
    imports: [ReactiveFormsModule, NgClass],
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {
    @ViewChild('modal', { static: false })
    public modal!: ElementRef;
    @Output() public emittedModalHide = new EventEmitter<boolean>();
    @HostListener('document:mousemove', ['$event'])
    public header = input.required<string>();
    public authForm!: FormGroup;
    public user: TProfile | null = null;

    constructor(private _store$: Store) {}

    ngOnInit(): void {
        this._createForm();
        this._authFormListener();
    }

    public onMouseMove(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!this.modal.nativeElement.contains(target)) {
            this.modal.nativeElement.classList.add('dimmed');
        } else {
            this.modal.nativeElement.classList.remove('dimmed');
        }
    }

    public confirmModalDialog() {
        this._checkAuth();
        this.emittedModalHide.emit(true);
    }

    public onBackgroundClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.classList.contains(this.modal.nativeElement.classList)) {
            this.closeModalDialog();
        }
    }

    public closeModalDialog() {
        this.emittedModalHide.emit(true);
    }

    public resetModalDialog() {
        this.authForm.patchValue({
            email: '',
            password: '',
        });
    }

    private _checkAuth() {
        const { email, password, guest } = this.authForm.value;
        if (guest) {
            this._store$.dispatch(AuthActions.getLoginGuest());
        } else if (this.authForm.valid) {
            this._store$.dispatch(AuthActions.getLogin({ email, password }));
        } else {
            const error = new Error('Invalid form');
            this._store$.dispatch(AuthActions.getLoginError({ error }));
        }
    }

    private _authFormListener() {
        this.authForm.get('guest')?.valueChanges.subscribe((isGuest) => {
            if (isGuest) {
                this.authForm.get('email')?.disable();
                this.authForm.get('password')?.disable();
            } else {
                this.authForm.get('email')?.enable();
                this.authForm.get('password')?.enable();
            }
        });
    }

    private _createForm(): FormGroup {
        this.authForm = new FormGroup({
            email: new FormControl('', {
                validators: [
                    Validators.required,
                    Validators.email,
                    Validators.minLength(3),
                ],
            }),
            password: new FormControl('', {
                validators: [Validators.required, Validators.minLength(3)],
            }),
            guest: new FormControl(false),
        });
        return this.authForm;
    }
}
