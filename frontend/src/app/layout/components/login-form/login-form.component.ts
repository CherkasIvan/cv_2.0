import { Observable, Subject, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Inject,
    Input,
    OnDestroy,
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

import { filter, find, map } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { ApiService } from '@core/service/api/api.service';

import { AuthActions } from '@layout/store/auth-store/auth.actions';
import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import {
    selectCloseImageUrl,
    selectDarkModeImages,
    selectWhiteModeImages,
} from '@layout/store/images-store/images.selectors';
import { TAuthUser } from '@layout/store/model/auth-user.type';
import { TProfile } from '@layout/store/model/profile.type';

@Component({
    selector: 'cv-login-form',
    standalone: true,
    imports: [ReactiveFormsModule, NgClass, AsyncPipe],
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit, OnDestroy {
    @ViewChild('modal', { static: false })
    public modal!: ElementRef;
    @Output() public emittedModalHide = new EventEmitter<boolean>();
    @HostListener('document:mousemove', ['$event'])
    public header = input.required<string>();
    public imageUrl$!: any;
    public url!: any;
    public authForm!: FormGroup;
    public user: TProfile | null = null;
    public whiteModeImages$!: Observable<string[]>;
    public closeImageUrl$!: Observable<string>;

    public onMouseMove(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!this.modal.nativeElement.contains(target)) {
            this.modal.nativeElement.classList.add('dimmed');
        } else {
            this.modal.nativeElement.classList.remove('dimmed');
        }
    }

    private _destroyed$: Subject<void> = new Subject();

    constructor(@Inject(Store) private _store$: Store<TAuthUser>) {}

    ngOnInit(): void {
        const isWhiteMode = true; // Set this based on your application's logic
        this._store$.dispatch(ImagesActions.getCloseImg({ mode: isWhiteMode }));

        this._createForm();
        this._authFormListener();
        this._store$.dispatch(ImagesActions.loadThemelessPicturesImages());
        this.closeImageUrl$ = this._store$.select(selectCloseImageUrl).pipe(
            map((response: any) => {
                console.log(response); // Log the response to see its structure
                if (Array.isArray(response)) {
                    const url = response.find((url: string) =>
                        url.includes('close'),
                    );
                    console.log(url); // Log the found URL
                    return url;
                } else {
                    console.error('Response is not an array:', response);
                    return null;
                }
            }),
        );
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

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
