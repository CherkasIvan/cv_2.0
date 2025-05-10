import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { DestroyService } from '@core/service/destroy/destroy.service';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { setModeSuccess } from '@store/dark-mode-store/dark-mode.actions';
import { ImagesActions } from '@store/images-store/images.actions';
import { selectToggleUrl } from '@store/images-store/images.selectors';
import { TDarkMode } from '@store/model/dark-mode.type';
import { TLocalstorageUser } from '@store/model/localstorage-user.type';

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
    public isChecked: boolean = false;
    public darkModeImage$ = new BehaviorSubject<string>('');
    public whiteModeImage$ = new BehaviorSubject<string>('');

    constructor(
        @Inject(Store) private _store$: Store<TDarkMode | TLocalstorageUser>,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
        private _localStorageService: LocalStorageService,
    ) {}

    public changeView(): void {
        this.isChecked = !this.isChecked;
        this._localStorageService.setDarkMode(this.isChecked);
        this._store$.dispatch(setModeSuccess(this.isChecked));
        this._store$.dispatch(
            ImagesActions.getToggleIcons({ mode: this.isChecked }),
        );
    }

    ngOnInit(): void {
        this.isChecked = this._localStorageService.getDarkMode() || false;
        this._store$.dispatch(setModeSuccess(this.isChecked));
        this._store$.dispatch(
            ImagesActions.getToggleIcons({ mode: this.isChecked }),
        );

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
