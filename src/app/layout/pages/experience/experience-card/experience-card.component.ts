import { NgClass, NgSwitch } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Output,
    input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Store } from '@ngrx/store';

import { IWorkExperience } from '@core/models/work-experience.interface';
import { fadeInOutCards } from '@core/utils/animations/fade-in-out-cards';

import { IEducationExperience } from '@app/core/models/education.interface';
import { ExperienceActions } from '@app/layout/store/experience-dialog-store/experience-dialog.actions';

@Component({
    selector: 'cv-experience-card',
    standalone: true,
    imports: [NgSwitch, NgClass, RouterLink],
    templateUrl: './experience-card.component.html',
    styleUrls: [
        './experience-card.component.scss',
        './experience-card-dm/experience-card-dm.component.scss',
    ],
    animations: [fadeInOutCards],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceCardComponent {
    public experienceType = input.required<string>();
    public workDescription = input<
        IWorkExperience | IEducationExperience | null
    >(null);
    public experienceDescription = input<
        IWorkExperience | IEducationExperience | null
    >(null);
    public experienceCardImgVisibility: boolean = false;
    public theme = input<boolean | null>();

    constructor(
        private cdr: ChangeDetectorRef,
        private _store$: Store,
    ) {}

    ngOnInit(): void {
        this.experienceType = this.experienceType || 'work';
        this.workDescription = this.workDescription || null;
        this.experienceDescription = this.experienceDescription || null;

        this.cdr.detectChanges();
    }

    public showDialogExperience(
        dialogInfo: IWorkExperience | IEducationExperience | null,
    ) {
        this._store$.dispatch(
            ExperienceActions.getExperienceDialogOpen({ data: dialogInfo }),
        );
    }
}
