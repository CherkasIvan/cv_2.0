// login-form.component.ts
import { NgClass, isPlatformBrowser } from '@angular/common';
import {
    Component,
    DestroyRef,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
    computed,
    inject,
    input,
    output,
    signal,
    PLATFORM_ID,
    Inject,
} from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { Store } from '@ngrx/store';

import { AuthActions } from '@layout/store/auth-store/auth.actions';
import {
    selectAuthError,
    selectAuthLoading,
} from '@layout/store/auth-store/auth.selectors';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import { selectCloseUrl } from '@layout/store/images-store/images.selectors';

import ALL_ANIMATION_CLASSES from '@assets/constant/animations.const';

import { TranslateModule } from '@ngx-translate/core';

import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
    selector: 'cv-login-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgClass,
        LanguageToggleComponent,
        TranslateModule,
        SpinnerComponent,
    ],
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {
    header = input.required<string>();
    emittedModalHide = output<boolean>();
    switchToRegister = output<void>();

    modalState = signal('in');
    modalToggleState = signal('expanded');
    isLoading = signal(false);
    error = signal<string | null>(null);
    closeImageUrl = signal<string>('');
    fieldsVisible = signal(true);
    isBrowser = false;

    authForm!: FormGroup;

    @ViewChild('modal', { static: false }) modal!: ElementRef;

    private _store$ = inject(Store);
    private destroyRef = inject(DestroyRef);

    public readonly cssClasses = ALL_ANIMATION_CLASSES;

    isGuestMode = computed(() => this.authForm?.get('guest')?.value ?? false);
    canSubmit = computed(
        () => (this.authForm?.valid || this.isGuestMode()) && !this.isLoading(),
    );
    showEmailPasswordFields = computed(() => !this.isGuestMode());

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!this.isBrowser) return;
        
        const target = event.target as HTMLElement;
        if (
            this.modal?.nativeElement &&
            !this.modal.nativeElement.contains(target)
        ) {
            this.modal.nativeElement.classList.add('dimmed');
        } else if (this.modal?.nativeElement) {
            this.modal.nativeElement.classList.remove('dimmed');
        }
    }

    ngOnInit(): void {
        this.createForm();
        if (this.isBrowser) {
            this.setupAuthFormListener();
            this.setupStoreSubscriptions();
            this._store$.dispatch(ImagesActions.loadCloseImage({ mode: true }));
        }
    }

    // 🎯 Public Methods
    confirmModalDialog() {
        if (this.isBrowser) {
            this.checkAuth();
        }
    }

    onBackgroundClick(event: MouseEvent): void {
        if (!this.isBrowser) return;
        
        const target = event.target as HTMLElement;
        if (target.classList.contains('modal-background')) {
            this.closeModalDialog();
        }
    }

    createAccount(): void {
        if (this.isBrowser) {
            console.log('Create account clicked - switching to registration');
            this.switchToRegister.emit();
        }
    }

    closeModalDialog() {
        if (this.isBrowser) {
            this.emittedModalHide.emit(true);
        }
    }

    resetModalDialog() {
        if (this.isBrowser) {
            this.authForm.patchValue({
                email: '',
                password: '',
                guest: false
            });
            this.error.set(null);
            this.fieldsVisible.set(true);
        }
    }

    toggleModal() {
        if (this.isBrowser) {
            this.modalToggleState.update((state) =>
                state === 'expanded' ? 'collapsed' : 'expanded',
            );
        }
    }

    // 🔒 Private Methods
    private checkAuth() {
        const { email, password, guest } = this.authForm.value;

        if (guest) {
            this._store$.dispatch(AuthActions.guestLogin());
        } else if (this.authForm.valid) {
            this._store$.dispatch(AuthActions.login({ email, password }));
        } else {
            this.error.set('Please fill in all required fields');
        }
    }

    private setupAuthFormListener() {
        if (!this.isBrowser) return;

        this.authForm
            .get('guest')
            ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((isGuest: boolean) => {
                if (isGuest) {
                    this.fieldsVisible.set(false);
                    setTimeout(() => {
                        this.authForm.get('email')?.disable();
                        this.authForm.get('password')?.disable();
                    }, 300);
                } else {
                    this.fieldsVisible.set(true);
                    this.authForm.get('email')?.enable();
                    this.authForm.get('password')?.enable();
                }
                this.toggleModal();
            });
    }

    private setupStoreSubscriptions() {
        if (!this.isBrowser) return;

        this._store$
            .select(selectAuthLoading)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((loading) => this.isLoading.set(loading));

        this._store$
            .select(selectAuthError)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((error) => this.error.set(error));

        this._store$
            .select(selectCloseUrl)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((url) => this.closeImageUrl.set(url));
    }

    private createForm(): FormGroup {
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