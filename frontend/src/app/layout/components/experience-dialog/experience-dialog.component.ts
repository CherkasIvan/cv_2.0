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

import { ExperienceActions } from '@layout/store/experience-dialog-store/experience-dialog.actions';
import { ModalState } from '@layout/store/experience-dialog-store/experience-dialog.reducers';
import { selectModalData } from '@layout/store/experience-dialog-store/experience-dialog.selectors';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import { selectCloseUrl } from '@layout/store/images-store/images.selectors';
import { TProfile } from '@layout/store/model/profile.type';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cv-experience-dialog',
    standalone: true,
    imports: [ReactiveFormsModule, AsyncPipe, NgIf, TranslateModule],
    templateUrl: './experience-dialog.component.html',
    styleUrls: ['./experience-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceDialogComponent implements OnInit {
    @ViewChild('modal', { static: false })
    public modal!: ElementRef;
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

    public modalData$!: Observable<IExperience | null>;
    public header = input.required<string>();
    public authForm!: FormGroup;
    public user: TProfile | null = null;

    constructor(
        @Inject(Store)
        private _store$: Store<{ experience: ModalState }>,
    ) {}

    ngOnInit(): void {
        this.modalData$ = this._store$.pipe(select(selectModalData));
        this._store$.dispatch(ImagesActions.getCloseImg({ mode: true }));
        this.closeImageUrl$ = this._store$.select(selectCloseUrl);
    }

    public onBackgroundClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.classList.contains(this.modal.nativeElement.classList)) {
            this._store$.dispatch(
                ExperienceActions.getExperienceDialogClosed(),
            );
        }
    }

    public closeModalDialog() {
        this._store$.dispatch(ExperienceActions.getExperienceDialogClosed());
    }
}
