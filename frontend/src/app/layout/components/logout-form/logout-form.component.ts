import {
    Observable,
    Subject,
    catchError,
    map,
    mergeMap,
    of,
    takeUntil,
} from 'rxjs';

import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { AuthService } from '@core/service/auth/auth.service';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { ImagesActions } from '@layout/store/images-store/images.actions';
import { selectCloseImageUrl } from '@layout/store/images-store/images.selectors';
import { TProfile } from '@layout/store/model/profile.type';

@Component({
    selector: 'cv-logout-form',
    standalone: true,
    imports: [ReactiveFormsModule, AsyncPipe],
    templateUrl: './logout-form.component.html',
    styleUrls: ['./logout-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutFormComponent implements OnInit, OnDestroy {
    @ViewChild('modal', { static: false })
    public modal!: ElementRef;
    @Output() public emittedModalHide = new EventEmitter<boolean>();
    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!this.modal.nativeElement.contains(target)) {
            this.modal.nativeElement.classList.add('dimmed');
        } else {
            this.modal.nativeElement.classList.remove('dimmed');
        }
    }

    public closeImageUrl$!: Observable<string>;
    public header = input.required<string>();
    public user: TProfile | null = null;
    public displayName = '';

    private _destroyed$: Subject<void> = new Subject();

    constructor(
        private _authService: AuthService,
        private _localStorageService: LocalStorageService,
        private _store$: Store,
    ) {}

    ngOnInit(): void {
        this.displayName =
            this._localStorageService.checkLocalStorageUserName();

        this._store$.dispatch(ImagesActions.loadThemelessPicturesImages());

        this.closeImageUrl$ = this._store$.select(selectCloseImageUrl).pipe(
            takeUntil(this._destroyed$),
            map((response: any) => {
                return response;
            }),
        );
    }

    public confirmLogout() {
        this._authService
            .signOut()
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                this.emittedModalHide.emit(false);
            });
    }

    public onBackgroundClick(event: Event): void {
        const target = event.target as HTMLElement;
        if (target.classList.contains(this.modal.nativeElement.classList)) {
            this.closeLogoutDialog();
        }
    }

    public closeLogoutDialog() {
        this.emittedModalHide.emit(false);
    }

    public resetModalDialog() {
        this.emittedModalHide.emit(false);
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
