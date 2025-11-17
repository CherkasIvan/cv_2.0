import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { DestroyService } from '@core/service/destroy/destroy.service';

import { setModeSuccess } from '@layout/store/dark-mode-store/dark-mode.actions';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import { selectToggleUrl } from '@layout/store/images-store/images.selectors';
import { TDarkMode } from '@layout/store/model/dark-mode.type';

@Component({
    selector: 'cv-dark-mode-toggle',
    standalone: true,
    imports: [NgClass, AsyncPipe],
    templateUrl: './dark-mode-toggle.component.html',
    styleUrls: ['./dark-mode-toggle.component.scss'],
    providers: [DestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeToggleComponent implements OnInit {
    public isChecked = false;
    public darkModeImage$ = new BehaviorSubject<string>('');
    public whiteModeImage$ = new BehaviorSubject<string>('');

    constructor(
        @Inject(Store) private _store$: Store<TDarkMode>,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
        private _cacheStorageService: CacheStorageService,
    ) {}

    public changeView(): void {
        this.isChecked = !this.isChecked;
        this._cacheStorageService.setDarkMode(this.isChecked);
        this._store$.dispatch(setModeSuccess(this.isChecked));
        this._store$.dispatch(
            ImagesActions.getToggleIcons({ mode: this.isChecked }),
        );
    }

    ngOnInit(): void {
        this._cacheStorageService
            .getDarkMode()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((darkMode) => {
                this.isChecked = darkMode;
                this._store$.dispatch(setModeSuccess(this.isChecked));
                this._store$.dispatch(
                    ImagesActions.getToggleIcons({ mode: this.isChecked }),
                );
            });

        this._store$
            .pipe(takeUntil(this._destroyed$), select(selectToggleUrl))
            .subscribe((url) => {
                this.darkModeImage$.next(url);
            });

        this._store$
            .pipe(takeUntil(this._destroyed$), select(selectToggleUrl))
            .subscribe((url) => {
                this.whiteModeImage$.next(url);
            });
    }
}
