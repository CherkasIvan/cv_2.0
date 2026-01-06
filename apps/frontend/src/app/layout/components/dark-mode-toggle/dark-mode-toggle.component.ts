import { BehaviorSubject } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Store, select } from '@ngrx/store';

import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';

import { setModeSuccess } from '@layout/store/dark-mode-store/dark-mode.actions';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import { selectToggleUrl } from '@layout/store/images-store/images.selectors';
import { TDarkModeState } from '@layout/store/model/dark-mode-state.type';

@Component({
    selector: 'cv-dark-mode-toggle',
    standalone: true,
    imports: [NgClass, AsyncPipe],
    templateUrl: './dark-mode-toggle.component.html',
    styleUrls: ['./dark-mode-toggle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeToggleComponent implements OnInit {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _store = inject<Store<TDarkModeState>>(Store);
    private readonly _cacheStorageService = inject(CacheStorageService);

    public isChecked = false;
    public readonly darkModeImage$ = new BehaviorSubject<string>('');
    public readonly whiteModeImage$ = new BehaviorSubject<string>('');

    public changeView(): void {
        this.isChecked = !this.isChecked;
        this._cacheStorageService.setDarkMode(this.isChecked);
        this._store.dispatch(setModeSuccess(this.isChecked));
        this._store.dispatch(
            ImagesActions.loadToggleIcons({ mode: this.isChecked }),
        );
    }

    public ngOnInit(): void {
        this._cacheStorageService
            .getDarkMode()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((darkMode: boolean) => {
                this.isChecked = darkMode;
                this._store.dispatch(setModeSuccess(this.isChecked));
                this._store.dispatch(
                    ImagesActions.loadToggleIcons({ mode: this.isChecked }),
                );
            });

        this._store
            .pipe(takeUntilDestroyed(this._destroyRef), select(selectToggleUrl))
            .subscribe((url: string) => {
                this.darkModeImage$.next(url);
                this.whiteModeImage$.next(url);
            });
    }
}
