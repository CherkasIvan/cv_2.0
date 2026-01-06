import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnInit,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Store, select } from '@ngrx/store';

import { TMainPageInfo } from '@core/models/main-page-info';

import { ButtonComponent } from '@layout/components/button/button.component';
import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import * as FirebaseActions from '@layout/store/firebase-store/firebase.actions';
import { selectMainPageInfo } from '@layout/store/firebase-store/firebase.selectors';
import { TDarkModeState } from '@layout/store/model/dark-mode-state.type';

import { TranslateModule } from '@ngx-translate/core';

import { ProfileLogoComponent } from '../../../layout/components/profile-logo/profile-logo.component';

@Component({
    selector: 'cv-main',
    standalone: true,
    imports: [
        ButtonComponent,
        ProfileLogoComponent,
        NgClass,
        AsyncPipe,
        TranslateModule,
    ],
    templateUrl: './main.component.html',
    styleUrls: [
        './main.component.scss',
        './main-dark-mode/main-dark-mode.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
    private readonly _cdr = inject(ChangeDetectorRef);
    private readonly _store =
        inject<Store<TDarkModeState | TMainPageInfo>>(Store);
    private readonly _destroyRef = inject(DestroyRef);

    public readonly mainInfo$ = this._store.pipe(
        select(selectMainPageInfo),
        takeUntilDestroyed(this._destroyRef),
    );

    protected _mainInfoPageData: TMainPageInfo | null = null;
    public mainInfoKeys: string[] = [];

    public readonly currentTheme$ = this._store.pipe(
        select(darkModeSelector),
        takeUntilDestroyed(this._destroyRef),
    );

    public ngOnInit(): void {
        this._store.dispatch(FirebaseActions.loadMainPageInfo({ imgName: '' }));

        this.mainInfo$.subscribe((info: TMainPageInfo | null) => {
            this._mainInfoPageData = info;
            if (info) {
                this.mainInfoKeys = Object.keys(info).sort();
                console.log(this.mainInfoKeys);
            }
            this._cdr.markForCheck();
        });
    }
}
