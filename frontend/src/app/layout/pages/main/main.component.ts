import { Observable, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { IMainPageInfo } from '@core/models/main-page-info';
import { DestroyService } from '@core/service/destroy/destroy.service';

import { ButtonComponent } from '@layout/components/button/button.component';

import { TranslateModule } from '@ngx-translate/core';
import { darkModeSelector } from '@store/dark-mode-store/dark-mode.selectors';
import { FirebaseActions } from '@store/firebase-store/firebase.actions';
import { selectMainPageInfo } from '@store/firebase-store/firebase.selectors';
import { TDarkMode } from '@store/model/dark-mode.type';

import { ProfileLogoComponent } from '../../../layout/components/profile-logo/profile-logo.component';

@Component({
    selector: 'cv-main',
    standalone: true,
    imports: [
        ButtonComponent,
        ProfileLogoComponent,
        RouterLink,
        NgClass,
        AsyncPipe,
        TranslateModule,
    ],
    templateUrl: './main.component.html',
    styleUrls: [
        './main.component.scss',
        './main-dark-mode/main-dark-mode.component.scss',
    ],
    providers: [DestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
    public mainInfo$: Observable<IMainPageInfo | null> = this._store$.pipe(
        select(selectMainPageInfo),
    );
    public mainInfoPageData: IMainPageInfo | null = null;
    public mainInfoKeys: string[] = [];

    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    constructor(
        private _cdr: ChangeDetectorRef,
        @Inject(Store) private _store$: Store<TDarkMode | IMainPageInfo>,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
    ) {}

    ngOnInit(): void {
        this._store$.dispatch(FirebaseActions.getMainPageInfo({ imgName: '' }));
        this.mainInfo$.pipe(takeUntil(this._destroyed$)).subscribe((info) => {
            this.mainInfoPageData = info;
            if (info) {
                this.mainInfoKeys = Object.keys(info).sort();
            }
            this._cdr.markForCheck();
        });
    }
}
