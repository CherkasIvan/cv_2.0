import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    input,
} from '@angular/core';

import { filter, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { IExperience } from '@core/models/experience.interface';
import { fadeInOutCards } from '@core/utils/animations/fade-in-out-cards';

import { ExperienceActions } from '@layout/store/experience-dialog-store/experience-dialog.actions';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import {
    selectArrowUrl,
    selectDownloadUrl,
} from '@layout/store/images-store/images.selectors';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cv-experience-card',
    standalone: true,
    imports: [NgClass, TranslateModule, AsyncPipe],
    templateUrl: './experience-card.component.html',
    styleUrls: [
        './experience-card.component.scss',
        './experience-card-dm/experience-card-dm.component.scss',
        './experience-card-media/experience-card-media.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // animations: [fadeInOutCards],
})
export class ExperienceCardComponent implements OnInit, OnChanges {
    @Input() experience: any;
    public experienceType = input.required<string>();
    public workDescription = input<IExperience | null>(null);
    public experienceDescription = input<IExperience | null>(null);
    public experienceCardImgVisibility: boolean = false;
    public theme = input<boolean | null>();

    public arrowUrl$ = this.store.select(selectArrowUrl).pipe(
        filter((url) => url !== undefined && url !== null),
        map((url) => url),
    );
    public downloadUrl$ = this.store.select(selectDownloadUrl).pipe(
        filter((url) => url !== undefined && url !== null),
        map((url) => url),
    );

    constructor(
        @Inject(ChangeDetectorRef) private _cdr: ChangeDetectorRef,
        @Inject(Store) private store: Store<IExperience>,
    ) {}

    private getMode(): boolean {
        return this.theme() || false;
    }

    ngOnInit(): void {
        console.log(this.workDescription());
        console.log(this.experienceDescription());
        this.initializeComponent();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['theme']) {
            this.initializeComponent();
        }
    }

    private initializeComponent(): void {
        const mode = !this.getMode();
        this.store.dispatch(ImagesActions.getArrowIcons({ mode }));
        this.store.dispatch(ImagesActions.getDownloadIcons({ mode }));
        this._cdr.detectChanges();
    }

    public showDialogExperience(dialogInfo: IExperience | null) {
        this.store.dispatch(
            ExperienceActions.getExperienceDialogOpen({ data: dialogInfo }),
        );
    }
}
