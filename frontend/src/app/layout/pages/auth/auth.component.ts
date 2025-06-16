import { takeUntil } from 'rxjs';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { DestroyService } from '@core/service/destroy/destroy.service';

import { ImagesActions } from '@layout/store/images-store/images.actions';
import { setLanguageSuccess } from '@layout/store/language-selector-store/language.actions';

import { TranslateService } from '@ngx-translate/core';

import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
    selector: 'cv-auth',
    standalone: true,
    imports: [LoginFormComponent],
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
    public isModalDialogVisible: boolean = false;

    public getModalInstance($event: boolean) {
        this.isModalDialogVisible = $event;
    }

    constructor(
        private _store$: Store,
        private _cacheStorageService: CacheStorageService,
        private _translateService: TranslateService,
        private _destroy: DestroyService,
    ) {}

    ngOnInit() {
        this._cacheStorageService.getLanguage().then((storedLanguage) => {
            const languageToSet = storedLanguage || 'en';

            this._translateService
                .use(languageToSet)
                .pipe(takeUntil(this._destroy))
                .subscribe(() => {
                    this._cacheStorageService.setLanguage(languageToSet);
                    this._store$.dispatch(setLanguageSuccess(languageToSet));
                });

            this._store$.dispatch(ImagesActions.getCloseImg({ mode: true }));
        });
    }
}
