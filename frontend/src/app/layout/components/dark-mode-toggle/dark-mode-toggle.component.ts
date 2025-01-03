import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { setModeSuccess } from '@layout/store/dark-mode-store/dark-mode.actions';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import { selectToggleUrl } from '@layout/store/images-store/images.selectors';
import { TDarkMode } from '@layout/store/model/dark-mode.type';
import { TLocalstorageUser } from '@layout/store/model/localstorage-user.type';

@Component({
    selector: 'cv-dark-mode-toggle',
    standalone: true,
    imports: [NgClass, AsyncPipe],
    templateUrl: './dark-mode-toggle.component.html',
    styleUrls: ['./dark-mode-toggle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeToggleComponent implements OnInit, OnDestroy {
    public isChecked: boolean = false;
    public darkModeImage$ = new BehaviorSubject<string>('');
    public whiteModeImage$ = new BehaviorSubject<string>('');
    private _destroyed$: Subject<void> = new Subject();

    constructor(
        @Inject(Store) private _store$: Store<TDarkMode | TLocalstorageUser>,
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

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
