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

import { IEducationExperience } from '@core/models/education.interface';
import { IWorkExperience } from '@core/models/work-experience.interface';

import { ExperienceActions } from '@layout/store/experience-dialog-store/experience-dialog.actions';
import { selectModalData } from '@layout/store/experience-dialog-store/experience-dialog.selectors';
import { TProfile } from '@layout/store/model/profile.type';

@Component({
    selector: 'cv-experience-dialog',
    standalone: true,
    imports: [ReactiveFormsModule, AsyncPipe, NgIf],
    templateUrl: './experience-dialog.component.html',
    styleUrl: './experience-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceDialogComponent implements OnInit {
    @ViewChild('modal', { static: false })
    public modal!: ElementRef;
    @HostListener('document:mousemove', ['$event'])
    public modalData$!: Observable<
        IWorkExperience | IEducationExperience | null
    >;
    public header = input.required<string>();
    public authForm!: FormGroup;
    public user: TProfile | null = null;

    constructor(
        @Inject(Store)
        private _store$: Store<IWorkExperience | IEducationExperience>,
    ) {}

    ngOnInit(): void {
        this.modalData$ = this._store$.pipe(select(selectModalData));
    }

    public onMouseMove(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!this.modal.nativeElement.contains(target)) {
            this.modal.nativeElement.classList.add('dimmed');
        } else {
            this.modal.nativeElement.classList.remove('dimmed');
        }
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
