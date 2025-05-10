import { Observable } from 'rxjs';

import { AsyncPipe, NgIf } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Inject,
    OnInit,
    ViewChild,
    input,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Store, select } from '@ngrx/store';

import { IExperience } from '@core/models/experience.interface';

import { TranslateModule } from '@ngx-translate/core';
import { ExperienceActions } from '@store/experience-dialog-store/experience-dialog.actions';
import { ModalState } from '@store/experience-dialog-store/experience-dialog.reducers';
import { selectModalData } from '@store/experience-dialog-store/experience-dialog.selectors';
import { ImagesActions } from '@store/images-store/images.actions';
import { selectCloseUrl } from '@store/images-store/images.selectors';
import { TProfile } from '@store/model/profile.type';

@Component({
    selector: 'cv-experience-dialog',
    standalone: true,
    imports: [ReactiveFormsModule, AsyncPipe, NgIf, TranslateModule],
    templateUrl: './experience-dialog.component.html',
    styleUrls: ['./experience-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceDialogComponent implements OnInit {
    @ViewChild('modal', { static: false }) public modal!: ElementRef;
    @ViewChild('modalDialog', { static: false })
    public modalDialog!: ElementRef;

    public modalData$!: Observable<IExperience | null>;
    public header = input.required<string>();
    public authForm!: FormGroup;
    public user: TProfile | null = null;
    public closeImageUrl$!: Observable<string>;
    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!this.modal.nativeElement.contains(target)) {
            this.modal.nativeElement.classList.add('dimmed');
        } else {
            this.modal.nativeElement.classList.remove('dimmed');
        }
    }

    constructor(
        @Inject(Store)
        private _store$: Store<{ experience: ModalState }>,
    ) {}

    ngOnInit(): void {
        this.modalData$ = this._store$.pipe(select(selectModalData));
        this._store$.dispatch(ImagesActions.getCloseImg({ mode: true }));
        this.closeImageUrl$ = this._store$.select(selectCloseUrl);
    }

    public onBackgroundClick(event: Event): void {
        const target = event.target as HTMLElement;
        if (!this.modalDialog.nativeElement.contains(target)) {
            this._store$.dispatch(
                ExperienceActions.getExperienceDialogClosed(),
            );
        }
    }

    public closeModalDialog(): void {
        const modalBackground = this.modal.nativeElement;
        const modalDialog = this.modalDialog.nativeElement;

        modalBackground.classList.add('closing');
        modalDialog.classList.add('closing');

        setTimeout(() => {
            this._store$.dispatch(
                ExperienceActions.getExperienceDialogClosed(),
            );
        }, 300);
    }
}
