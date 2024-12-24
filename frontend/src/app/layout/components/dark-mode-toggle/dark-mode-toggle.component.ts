import { Observable, Subject, map, takeUntil, tap } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { setModeSuccess } from '@layout/store/dark-mode-store/dark-mode.actions';
import {
    selectDarkModeImageUrl,
    selectWhiteModeImageUrl,
} from '@layout/store/images-store/images.selectors';
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
export class DarkModeToggleComponent implements OnInit {
    public isChecked: boolean = false;
    public darkModeImages$!: Observable<string>;
    public whiteModeImages$!: Observable<string>;

    private _destroyed$: Subject<void> = new Subject();

    constructor(
        @Inject(Store) private _store$: Store<TDarkMode | TLocalstorageUser>,
        private _localStorageService: LocalStorageService,
    ) {}

    public changeView(): void {
        this.isChecked = !this.isChecked;
        this._localStorageService.setDarkMode(this.isChecked);
        this._store$.dispatch(setModeSuccess(this.isChecked));
    }

    ngOnInit(): void {
        this.isChecked = this._localStorageService.getDarkMode() || false;
        this._store$.dispatch(setModeSuccess(this.isChecked));

        this.darkModeImages$ = this._store$.pipe(
            takeUntil(this._destroyed$),
            select(selectDarkModeImageUrl),
            tap((el) => {
                console.log('Dark Mode Images:', el);
            }),
            map((response: any) => response),
        );

        this.whiteModeImages$ = this._store$.pipe(
            takeUntil(this._destroyed$),
            select(selectWhiteModeImageUrl),
            tap((el) => {
                console.log('White Mode Images:', el);
            }),
            map((response: any) => response),
        );
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
