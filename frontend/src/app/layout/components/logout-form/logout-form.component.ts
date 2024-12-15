import { Subject, catchError, map, mergeMap, of, takeUntil } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    input,
    signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ApiService } from '@core/service/api/api.service';
import { AuthService } from '@core/service/auth/auth.service';
import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

import { ImagesActions } from '@layout/store/images-store/images.actions';
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
    public header = input.required<string>();
    public user: TProfile | null = null;
    public displayName = '';

    private _destroyed$: Subject<void> = new Subject();
    actions$: any;
    apiService: any;

    constructor(
        private _authService: AuthService,
        private _localStorageService: LocalStorageService,
        private _apiService: ApiService,
        private _actions$: Actions,
    ) {}

    public onMouseMove(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!this.modal.nativeElement.contains(target)) {
            this.modal.nativeElement.classList.add('dimmed');
        } else {
            this.modal.nativeElement.classList.remove('dimmed');
        }
    }

    ngOnInit(): void {
        this.displayName =
            this._localStorageService.checkLocalStorageUserName();
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
    getClose$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ImagesActions.getCloseImg),
            mergeMap((action: any) =>
                this.apiService
                    .getImages(
                        action.mode ? 'white-mode' : 'dark-mode',
                        'close',
                    ) // Добавлен параметр 'close'
                    .pipe(
                        map((data) => {
                            if (Array.isArray(data)) {
                                const imageUrl =
                                    data.find((url: string) =>
                                        url.includes('close'),
                                    ) || '';
                                return ImagesActions.getCloseImgSuccess({
                                    imageUrl,
                                });
                            } else {
                                console.error(
                                    'Expected an array but got:',
                                    data,
                                );
                                return ImagesActions.getCloseImgFailure({
                                    error: 'Invalid data format',
                                });
                            }
                        }),
                        catchError((error) =>
                            of(ImagesActions.getCloseImgFailure({ error })),
                        ),
                    ),
            ),
        ),
    );

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
