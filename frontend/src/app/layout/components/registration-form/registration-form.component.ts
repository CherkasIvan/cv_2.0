// registration-form.component.ts
import { AsyncPipe, NgClass, isPlatformBrowser } from '@angular/common';
import {
    Component,
    DestroyRef,
    inject,
    input,
    output,
    signal,
    PLATFORM_ID,
    Inject,
    OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';

import { Store } from '@ngrx/store';

import { AuthService } from '@core/service/auth/auth.service';

import { ImagesActions } from '@layout/store/images-store/images.actions';
import { selectCloseUrl } from '@layout/store/images-store/images.selectors';

import ALL_ANIMATION_CLASSES from '@assets/constant/animations.const';

import { TranslateModule } from '@ngx-translate/core';

import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';

// Validator function
function passwordMatchValidator(
    control: AbstractControl,
): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
        password &&
        confirmPassword &&
        password.value !== confirmPassword.value
    ) {
        return { passwordMismatch: true };
    }
    return null;
}

@Component({
    selector: 'cv-registration-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgClass,
        AsyncPipe,
        LanguageToggleComponent,
        TranslateModule,
    ],
    templateUrl: './registration-form.component.html',
    styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit {
    header = input.required<string>();
    emittedModalHide = output<boolean>();
    switchToLogin = output<void>();

    isLoading = signal(false);
    error = signal<string | null>(null);
    modalState = signal('expanded');
    isBrowser = false;

    public readonly cssClasses = ALL_ANIMATION_CLASSES;

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private store = inject(Store);
    private destroyRef = inject(DestroyRef);

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    registrationForm = this.fb.group(
        {
            name: ['', [Validators.required, Validators.minLength(2)]],
            positions: this.fb.array<string>([]),
            positionInput: [''],
            emails: this.fb.array<string>([]),
            emailInput: ['', [Validators.email]],
            phones: this.fb.array<string>([]),
            phoneInput: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
            loginEmail: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]],
            bio: ['', [Validators.maxLength(500)]],
            locations: this.fb.array<string>([]),
            locationInput: [''],
        },
        {
            validators: [passwordMatchValidator],
        },
    );

    closeImageUrl$ = this.store.select(selectCloseUrl);

    get positionsArray(): FormArray {
        return this.registrationForm.get('positions') as FormArray;
    }

    get emailsArray(): FormArray {
        return this.registrationForm.get('emails') as FormArray;
    }

    get phonesArray(): FormArray {
        return this.registrationForm.get('phones') as FormArray;
    }

    get locationsArray(): FormArray {
        return this.registrationForm.get('locations') as FormArray;
    }

    ngOnInit(): void {
        if (this.isBrowser) {
            this.store.dispatch(ImagesActions.loadCloseImage({ mode: true }));
        }
    }

    onBackgroundClick(event: MouseEvent): void {
        if (!this.isBrowser) return;
        
        if (
            (event.target as HTMLElement).classList.contains('modal-background')
        ) {
            this.closeModalDialog();
        }
    }

    confirmRegistration(): void {
        if (!this.isBrowser) return;
        
        if (this.registrationForm.valid) {
            this.isLoading.set(true);
            this.error.set(null);

            const formValue = this.registrationForm.getRawValue();

            const registrationData = {
                name: formValue.name || '',
                positions: this.positionsArray.value.filter(
                    Boolean,
                ) as string[],
                emails: this.emailsArray.value.filter(Boolean) as string[],
                phones: this.phonesArray.value.filter(Boolean) as string[],
                loginEmail: formValue.loginEmail || '',
                password: formValue.password || '',
                confirmPassword: formValue.confirmPassword || '',
                bio: formValue.bio || '',
                locations: this.locationsArray.value.filter(
                    Boolean,
                ) as string[],
            };

            this.authService
                .register(registrationData)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: () => {
                        this.isLoading.set(false);
                        this.closeModalDialog();
                    },
                    error: (err) => {
                        this.isLoading.set(false);
                        this.error.set(err.message || 'Registration failed');
                    },
                });
        } else {
            this.markFormGroupTouched();
        }
    }

    closeModalDialog(): void {
        if (this.isBrowser) {
            this.emittedModalHide.emit(true);
        }
    }

    resetRegistrationForm(): void {
        if (!this.isBrowser) return;
        
        this.registrationForm.reset({
            name: '',
            positionInput: '',
            emailInput: '',
            phoneInput: '',
            loginEmail: '',
            password: '',
            confirmPassword: '',
            bio: '',
            locationInput: '',
        });
        this.clearFormArray(this.positionsArray);
        this.clearFormArray(this.emailsArray);
        this.clearFormArray(this.phonesArray);
        this.clearFormArray(this.locationsArray);
        this.error.set(null);
    }

    switchToLoginForm(): void {
        if (this.isBrowser) {
            this.switchToLogin.emit();
        }
    }

    addEmail(): void {
        if (!this.isBrowser) return;
        
        const emailInput = this.registrationForm.get('emailInput');
        if (emailInput?.valid && emailInput.value) {
            const newEmail = emailInput.value.trim();
            this.emailsArray.push(this.fb.control(newEmail));
            emailInput.reset();
        }
    }

    removeEmail(index: number): void {
        if (this.isBrowser) {
            this.emailsArray.removeAt(index);
        }
    }

    addPosition(): void {
        if (!this.isBrowser) return;
        
        const positionInput = this.registrationForm.get('positionInput');
        if (positionInput?.value) {
            const newPosition = positionInput.value.trim();
            this.positionsArray.push(this.fb.control(newPosition));
            positionInput.reset();
        }
    }

    removePosition(index: number): void {
        if (this.isBrowser) {
            this.positionsArray.removeAt(index);
        }
    }

    addPhone(): void {
        if (!this.isBrowser) return;
        
        const phoneInput = this.registrationForm.get('phoneInput');
        if (phoneInput?.valid && phoneInput.value) {
            const newPhone = phoneInput.value.trim();
            this.phonesArray.push(this.fb.control(newPhone));
            phoneInput.reset();
        }
    }

    removePhone(index: number): void {
        if (this.isBrowser) {
            this.phonesArray.removeAt(index);
        }
    }

    addLocation(): void {
        if (!this.isBrowser) return;
        
        const locationInput = this.registrationForm.get('locationInput');
        if (locationInput?.value) {
            const newLocation = locationInput.value.trim();
            this.locationsArray.push(this.fb.control(newLocation));
            locationInput.reset();
        }
    }

    removeLocation(index: number): void {
        if (this.isBrowser) {
            this.locationsArray.removeAt(index);
        }
    }

    private markFormGroupTouched(): void {
        Object.keys(this.registrationForm.controls).forEach((key) => {
            const control = this.registrationForm.get(key);
            control?.markAsTouched();
        });
    }

    private clearFormArray(formArray: FormArray): void {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    }
}