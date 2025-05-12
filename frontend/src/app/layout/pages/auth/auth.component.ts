import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { TranslateService } from '@ngx-translate/core';
import { ImagesActions } from '@store/images-store/images.actions';
import { setLanguageSuccess } from '@store/language-selector-store/language.actions';

import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
    selector: 'cv-auth',
    standalone: true,
    imports: [LoginFormComponent],
    templateUrl: './auth.component.html',
    styleUrls: [
        './styles/auth.component.scss',
        './styles/auth-dm.component.scss',
        './styles/auth-mobile.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
    public isModalDialogVisible: boolean = false;

    public getModalInstance($event: boolean) {
        this.isModalDialogVisible = $event;
    }

    constructor(
        private _store$: Store,
        private _localStorageService: LocalStorageService,
        private _translateService: TranslateService,
    ) {}

    ngOnInit() {
        const storedLanguage = this._localStorageService.getLanguage();
        const languageToSet = storedLanguage || 'en';

        this._translateService.use(languageToSet).subscribe(() => {
            this._localStorageService.setLanguage(languageToSet);
            this._store$.dispatch(setLanguageSuccess(languageToSet));
        });

        this._store$.dispatch(ImagesActions.getCloseImg({ mode: true }));
    }
}
