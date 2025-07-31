import { Observable, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Inject,
    OnInit,
    Output,
    ViewChild,
    input,
} from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { Store } from '@ngrx/store';

import { DestroyService } from '@core/service/destroy/destroy.service';
import {
    loginFadeInOut,
    toggleHeight,
} from '@core/utils/animations/login.animation';

import { AuthActions } from '@layout/store/auth-store/auth.actions';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import { selectCloseUrl } from '@layout/store/images-store/images.selectors';
import { TAuthUser } from '@layout/store/model/auth-user.type';
import { TProfile } from '@layout/store/model/profile.type';

import { TranslateModule } from '@ngx-translate/core';

import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';

@Component({
    selector: 'cv-login-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgClass,
        AsyncPipe,
        LanguageToggleComponent,
        TranslateModule,
    ],
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
    // animations: [loginFadeInOut, toggleHeight],
    providers: [DestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {
    @ViewChild('modal', { static: false })
    public modal!: ElementRef;
    @Output() public emittedModalHide: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    @HostListener('document:mousemove', ['$event'])
    public header = input.required<string>();
    public imageUrl$!: any;
    public url!: any;
    public authForm!: FormGroup;
    public user: TProfile | null = null;
    public closeImageUrl$!: Observable<string>;
    public modalState = 'in';
    public modalToggleState = 'expanded';

    public onMouseMove(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!this.modal.nativeElement.contains(target)) {
            this.modal.nativeElement.classList.add('dimmed');
        } else {
            this.modal.nativeElement.classList.remove('dimmed');
        }
    }

    constructor(
        @Inject(Store) private _store$: Store<TAuthUser>,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
    ) {}

    ngOnInit(): void {
        this._createForm();
        this._authFormListener();
        this.closeImageUrl$ = this._store$.select(selectCloseUrl);
        this._store$.dispatch(ImagesActions.getCloseImg({ mode: true }));
    }

    public confirmModalDialog() {
        console.log('Confirm modal dialog called');
        this._checkAuth();
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

    public toggleModal() {
        this.modalToggleState =
            this.modalToggleState === 'expanded' ? 'collapsed' : 'expanded';
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
        this.authForm
            .get('guest')
            ?.valueChanges.pipe(takeUntil(this._destroyed$))
            .subscribe((isGuest) => {
                if (isGuest) {
                    this.authForm.get('email')?.disable();
                    this.authForm.get('password')?.disable();
                } else {
                    this.authForm.get('email')?.enable();
                    this.authForm.get('password')?.enable();
                }
                this.toggleModal();
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
