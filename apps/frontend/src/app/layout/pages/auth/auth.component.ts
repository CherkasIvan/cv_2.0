// auth.component.ts
import { isPlatformBrowser } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    Inject,
    OnInit,
    PLATFORM_ID,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Store } from '@ngrx/store';

import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';

import { RegistrationFormComponent } from '@layout/components/registration-form/registration-form.component';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import { setLanguageSuccess } from '@layout/store/language-selector-store/language.actions';

import { TranslateService } from '@ngx-translate/core';

import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
    selector: 'cv-auth',
    standalone: true,
    imports: [LoginFormComponent, RegistrationFormComponent],
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
    isModalDialogVisible = signal(false);
    currentForm = signal<'login' | 'register'>('login');
    isBrowser = false;

    private _store$ = inject(Store);
    private _cacheStorageService = inject(CacheStorageService);
    private _translateService = inject(TranslateService);
    private _destroyRef = inject(DestroyRef);

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    getModalInstance($event: boolean): void {
        if (this.isBrowser) {
            this.isModalDialogVisible.set($event);
            console.log('Modal visibility changed:', $event);
        }
    }

    switchToRegister(): void {
        if (this.isBrowser) {
            this.currentForm.set('register');
            console.log('Switching to registration form');
        }
    }

    switchToLogin(): void {
        if (this.isBrowser) {
            this.currentForm.set('login');
            console.log('Switching to login form');
        }
    }

    ngOnInit(): void {
        if (this.isBrowser) {
            this.initializeLanguage();
            this._store$.dispatch(ImagesActions.loadCloseImage({ mode: true }));
        }
    }

    private initializeLanguage(): void {
        if (!this.isBrowser) return;

        this._cacheStorageService
            .getLanguage()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (storedLanguage: 'ru' | 'en') => {
                    const languageToSet = storedLanguage || 'en';
                    this.setLanguage(languageToSet);
                },
                error: (err) => console.error('Failed to get language:', err),
            });
    }

    private setLanguage(language: 'ru' | 'en'): void {
        if (!this.isBrowser) return;

        this._translateService
            .use(language)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this._cacheStorageService.setLanguage(language);
                    this._store$.dispatch(setLanguageSuccess(language));
                },
                error: (err) => console.error('Language change error:', err),
            });
    }
}
