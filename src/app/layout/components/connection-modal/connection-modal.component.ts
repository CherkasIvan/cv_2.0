import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    ViewChild,
    input,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';

import { TAuth } from '@app/core/models/auth.type';

@Component({
    selector: 'cv-connection-modal',
    standalone: true,
    imports: [],
    templateUrl: './connection-modal.component.html',
    styleUrl: './connection-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionModalComponent implements OnInit {
    @ViewChild('modal', { static: false })
    public modal!: ElementRef;
    @Output() public emittedModalHide = new EventEmitter<boolean>();
    @HostListener('document:mousemove', ['$event'])
    public header = input.required<string>();
    public authForm!: FormGroup;
    public user: TAuth | null = null;

    constructor(private _store$: Store) {}

    ngOnInit(): void {
        this._createForm();
    }

    public onMouseMove(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!this.modal.nativeElement.contains(target)) {
            this.modal.nativeElement.classList.add('dimmed');
        } else {
            this.modal.nativeElement.classList.remove('dimmed');
        }
    }

    public confirmModalDialog() {
        this._checkAuth();
        this.emittedModalHide.emit(false);
    }

    public onBackgroundClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.classList.contains(this.modal.nativeElement.classList)) {
            this.closeModalDialog();
        }
    }

    public closeModalDialog() {
        this.emittedModalHide.emit(false);
    }

    public resetModalDialog() {
        this.emittedModalHide.emit(false);
    }

    private _checkAuth() {
        const { email, password } = this.authForm.value;

        if (this.authForm.valid) {
            this._store$.dispatch(authSuccess({ user }));
            this._authService.signIn(email, password);
        } else {
            this._store$.dispatch(authFailure({ error: Error }));
        }
    }

    private _createForm(): FormGroup {
        this.authForm = new FormGroup({
            email: new FormControl('', {
                validators: [Validators.required, Validators.email],
            }),
            password: new FormControl('', {
                validators: [Validators.required],
            }),
        });
        return this.authForm;
    }
}
