import { NgClass, NgSwitch } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Store } from '@ngrx/store';

import { IExperience } from '@core/models/experience.interface';
import { fadeInOutCards } from '@core/utils/animations/fade-in-out-cards';

import { ExperienceActions } from '@layout/store/experience-dialog-store/experience-dialog.actions';

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
export class ExperienceCardComponent implements OnInit {
    public experienceType = input.required<string>();
    public workDescription = input<IExperience | null>(null);
    public experienceDescription = input<IExperience | null>(null);
    public experienceCardImgVisibility: boolean = false;
    public theme = input<boolean | null>();

    constructor(
        private _cdr: ChangeDetectorRef,
        @Inject(Store) private _store$: Store<IExperience>,
    ) {}

    ngOnInit(): void {
        this.experienceType = this.experienceType || 'work';
        this.workDescription = this.workDescription || null;
        this.experienceDescription = this.experienceDescription || null;

        this._cdr.detectChanges();
    }

    public showDialogExperience(dialogInfo: IExperience | IExperience | null) {
        this._store$.dispatch(
            ExperienceActions.getExperienceDialogOpen({ data: dialogInfo }),
        );
    }
}
