import { Observable, Subject, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { IMainPageInfo } from '@core/models/main-page-info';

import { ButtonComponent } from '@layout/components/button/button.component';
import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { FirebaseActions } from '@layout/store/firebase-store/firebase.actions';
import { selectMainPageInfo } from '@layout/store/firebase-store/firebase.selectors';
import { IDarkMode } from '@layout/store/model/dark-mode.interface';

import { ProfileLogoComponent } from '../../../layout/components/profile-logo/profile-logo.component';

@Component({
    selector: 'cv-main',
    imports: [
        ButtonComponent,
        ProfileLogoComponent,
        RouterLink,
        NgClass,
        AsyncPipe,
    ],
    templateUrl: './main.component.html',
    styleUrls: [
        './main.component.scss',
        './main-dark-mode/main-dark-mode.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit, OnDestroy {
    public mainInfo$: Observable<IMainPageInfo | null> = this._store$.pipe(
        select(selectMainPageInfo),
    );
    public mainInfoPageData: IMainPageInfo | null = null;

    private destroyed$: Subject<void> = new Subject();
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    constructor(
        private _cdr: ChangeDetectorRef,
        private _store$: Store<IDarkMode | IMainPageInfo>,
    ) {}

    ngOnInit(): void {
        this._store$.dispatch(FirebaseActions.getMainPageInfo({ imgName: '' }));
        this.mainInfo$.pipe(takeUntil(this.destroyed$)).subscribe((info) => {
            this.mainInfoPageData = info;
            this._cdr.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
