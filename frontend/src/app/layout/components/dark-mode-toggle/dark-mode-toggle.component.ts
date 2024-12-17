import { Observable, map, tap } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { setModeSuccess } from '@layout/store/dark-mode-store/dark-mode.actions';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import {
    selectDarkModeImages,
    selectWhiteModeImages,
} from '@layout/store/images-store/images.selectors';
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
    public darkModeImages$!: Observable<string[]>;
    public whiteModeImages$!: Observable<string[]>;

    constructor(
        private _store$: Store<TDarkMode | TLocalstorageUser>,
        private _localStorageService: LocalStorageService,
    ) {}

    public changeView(): void {
        this.isChecked = !this.isChecked;
        this._localStorageService.setDarkMode(this.isChecked);
        this._store$.dispatch(setModeSuccess(this.isChecked));

        console.log('Dispatching loadThemelessPicturesImages action');
        this._store$.dispatch(ImagesActions.loadThemelessPicturesImages());
    }

    ngOnInit(): void {
        this.isChecked = this._localStorageService.getDarkMode() || false;
        this._store$.dispatch(setModeSuccess(this.isChecked));

        // Dispatch the action to load themeless pictures images
        this._store$.dispatch(ImagesActions.loadThemelessPicturesImages());

        // Select the images from the store
        this.darkModeImages$ = this._store$.pipe(
            select(selectDarkModeImages),
            tap((el) => console.log('moon', el)),
            map((response: any) => response),
        );

        this.whiteModeImages$ = this._store$.pipe(
            select(selectWhiteModeImages),
            tap((el) => console.log('sun', el)),
            map((response: any) => response),
        );
    }
}
