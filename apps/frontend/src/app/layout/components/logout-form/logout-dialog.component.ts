import { Observable, map, takeUntil } from 'rxjs';

import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Inject,
    ViewChild,
    effect,
    input,
    output,
    signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';

import { AuthService } from '@core/service/auth/auth.service';
import { CacheStorageService } from '@core/service/cache-storage/cache-storage.service';
import { DestroyService } from '@core/service/destroy/destroy.service';

import { selectCloseUrl } from '@layout/store/images-store/images.selectors';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cv-logout-dialog',
    standalone: true,
    imports: [ReactiveFormsModule, TranslateModule],
    templateUrl: './logout-dialog.component.html',
    styleUrls: ['./logout-dialog.component.scss'],
    providers: [DestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutDialogComponent {
    // Входные параметры через signal-based input API
    public header = input.required<string>();

    // Выходные события через signal-based output API
    public emittedModalHide = output<boolean>();

    // Реактивные сигналы для состояния
    public displayName = signal('');
    public closeImageUrl = signal('');

    // Ссылка на элемент модального окна
    @ViewChild('modal', { static: false })
    public modal!: ElementRef;

    constructor(
        @Inject(DestroyService) private _destroyed$: Observable<void>,
        private _authService: AuthService,
        private _cacheStorageService: CacheStorageService,
        private _store$: Store,
    ) {
        // Инициализация данных через эффекты
        effect(() => {
            // FIX: Use userName signal directly instead of getUserName() method
            const name = this._cacheStorageService.userName();
            this.displayName.set(name);
        });

        effect(() => {
            this._store$
                .select(selectCloseUrl)
                .pipe(
                    takeUntil(this._destroyed$),
                    map((response) => response as string),
                )
                .subscribe((url) => this.closeImageUrl.set(url));
        });
    }

    // Обработчик движения мыши с использованием сигналов
    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!this.modal?.nativeElement?.contains(target)) {
            this.modal.nativeElement.classList.add('dimmed');
        } else {
            this.modal.nativeElement.classList.remove('dimmed');
        }
    }

    // Методы с использованием сигналов
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
}
