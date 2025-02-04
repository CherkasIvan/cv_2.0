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
    ViewEncapsulation,
    input,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

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
    ],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInOutCards],
})
export class ExperienceCardComponent implements OnInit, OnChanges {
    @Input() experience: any;
    public experienceType = input.required<string>();
    public workDescription = input<IExperience | null>(null);
    public experienceDescription = input<IExperience | null>(null);
    public experienceCardImgVisibility: boolean = false;
    public theme = input<boolean | null>();

    public arrowUrl$ = this.store.select(selectArrowUrl);
    public downloadUrl$ = this.store.select(selectDownloadUrl);

    constructor(
        private _cdr: ChangeDetectorRef,
        @Inject(Store) private store: Store<IExperience>,
        private router: Router,
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.initializeComponent();
            }
        });
    }

    private getMode(): boolean {
        console.log(this.theme());
        return this.theme() || false;
    }

    ngOnInit(): void {
        this.initializeComponent();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['theme']) {
            this.initializeComponent();
            console.log(this.experienceType());
        }
    }

    private initializeComponent(): void {
        this.experienceType = this.experienceType;
        this.workDescription = this.workDescription || null;
        this.experienceDescription = this.experienceDescription || null;
        const mode = this.getMode();
        console.log(mode);
        this.store.dispatch(ImagesActions.getArrowIcons({ mode }));
        this.store.dispatch(ImagesActions.getDownloadIcons({ mode }));
        this._cdr.detectChanges();
    }

    public showDialogExperience(dialogInfo: IExperience | IExperience | null) {
        this.store.dispatch(
            ExperienceActions.getExperienceDialogOpen({ data: dialogInfo }),
        );
    }
}
