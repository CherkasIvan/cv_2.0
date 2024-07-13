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

import { ButtonComponent } from '@layout/components/button/button.component';

import { IMainPageInfo } from '@app/core/models/main-page-info';
import { FirebaseService } from '@app/core/service/firebase/firebase.service';
import { darkModeSelector } from '@app/layout/store/dark-mode-store/dark-mode.selectors';

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
    ],
    templateUrl: './main.component.html',
    styleUrls: [
        './main.component.scss',
        './main-dark-mode/main-dark-mode.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit, OnDestroy {
    public mainInfo$: Observable<IMainPageInfo> =
        this._firebaseService.getMainPageInfo();
    public mainInfoPageData: IMainPageInfo | null = null;

    private destroyed$: Subject<void> = new Subject();
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    constructor(
        private _firebaseService: FirebaseService,
        private _cdr: ChangeDetectorRef,
        private _store$: Store,
    ) {}

    ngOnInit(): void {
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
