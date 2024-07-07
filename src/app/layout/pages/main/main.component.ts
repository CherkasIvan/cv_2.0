import { Observable, Subject, takeUntil } from 'rxjs';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@layout/components/button/button.component';

import { IMainPageInfo } from '@app/core/models/main-page-info';
import { FirebaseService } from '@app/core/service/firebase/firebase.service';

import { ProfileLogoComponent } from '../../../layout/components/profile-logo/profile-logo.component';

@Component({
    selector: 'cv-main',
    standalone: true,
    imports: [ButtonComponent, ProfileLogoComponent, RouterLink],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit, OnDestroy {
    public mainInfo$: Observable<IMainPageInfo> =
        this._firebaseService.getMainPageInfo();
    public mainInfoPageData: IMainPageInfo | null = null;

    private destroyed$: Subject<void> = new Subject();

    constructor(
        private _firebaseService: FirebaseService,
        private _cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.mainInfo$.pipe(takeUntil(this.destroyed$)).subscribe((info) => {
            this.mainInfoPageData = info;
            console.log(this.mainInfoPageData);
            this._cdr.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
