import { Observable } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { setModeSuccess } from '@layout/store/dark-mode-store/dark-mode.actions';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import { selectCloseImageUrl } from '@layout/store/images-store/images.selectors';
import { TDarkMode } from '@layout/store/model/dark-mode.type';
import { TLocalstorageUser } from '@layout/store/model/localstorage-user.type';

@Component({
    selector: 'cv-dark-mode-toggle',
    standalone: true,
    imports: [NgClass, AsyncPipe],
    templateUrl: './dark-mode-toggle.component.html',
    styleUrl: './dark-mode-toggle.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeToggleComponent implements OnInit {
    public isChecked: boolean = false;
    public closeImageUrl$!: Observable<string | undefined>;

    constructor(
        private _store$: Store<TDarkMode | TLocalstorageUser>,
        private _localStorageService: LocalStorageService,
    ) {}

    public changeView(): void {
        this.isChecked = !this.isChecked;
        this._localStorageService.setDarkMode(this.isChecked);
        this._store$.dispatch(setModeSuccess(this.isChecked));
    }

    ngOnInit(): void {
        if (this._localStorageService.getDarkMode()) {
            this.isChecked = this._localStorageService.getDarkMode();
            this._store$.dispatch(setModeSuccess(this.isChecked));
        }
        this.isChecked = this._localStorageService.getDarkMode();
    }
}
