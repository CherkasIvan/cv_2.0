import { map } from 'rxjs';

import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    HostListener,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';

import { AuthService } from '@core/service/auth/auth.service';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';

import { selectCloseUrl } from '@layout/store/images-store/images.selectors';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cv-logout-dialog',
    standalone: true,
    imports: [ReactiveFormsModule, TranslateModule],
    templateUrl: './logout-dialog.component.html',
    styleUrls: ['./logout-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutDialogComponent {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _authService = inject(AuthService);
    private readonly _cacheStorageService = inject(CacheStorageService);
    private readonly _store = inject(Store);

    public readonly header = input.required<string>();
    public readonly emittedModalHide = output<boolean>();

    public readonly displayName = signal<string>('');
    public readonly closeImageUrl = signal<string>('');

    protected readonly _modal = viewChild<ElementRef>('modal');

    public constructor() {
        this._cacheStorageService.userName$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((name: string) => {
                this.displayName.set(name);
            });

        this._store
            .select(selectCloseUrl)
            .pipe(
                takeUntilDestroyed(this._destroyRef),
                map((response) => response as string),
            )
            .subscribe((url: string) => this.closeImageUrl.set(url));
    }

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(event: MouseEvent): void {
        const modalElement = this._modal()?.nativeElement;
        if (!modalElement) return;

        const target = event.target as HTMLElement;
        if (!modalElement.contains(target)) {
            modalElement.classList.add('dimmed');
        } else {
            modalElement.classList.remove('dimmed');
        }
    }

    public confirmLogout(): void {
        this._authService
            .signOut()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                this.emittedModalHide.emit(false);
            });
    }

    public onBackgroundClick(event: Event): void {
        const modalElement = this._modal()?.nativeElement;
        if (!modalElement) return;

        const target = event.target as HTMLElement;
        if (target.classList.contains(modalElement.classList)) {
            this.closeLogoutDialog();
        }
    }

    public closeLogoutDialog(): void {
        this.emittedModalHide.emit(false);
    }

    public resetModalDialog(): void {
        this.emittedModalHide.emit(false);
    }
}
