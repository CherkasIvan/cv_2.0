import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    signal,
} from '@angular/core';

import { filter, map } from 'rxjs/operators';

import { TEducationExperience } from '@core/models/education-experience.type';
import { TWorkExperience } from '@core/models/work-experience.type';
import { ExperienceActions } from '@layout/store/experience-dialog-store/experience-dialog.actions';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import {
    selectArrowUrl,
    selectDownloadUrl,
} from '@layout/store/images-store/images.selectors';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cv-experience-card',
    standalone: true,
    imports: [NgClass, TranslateModule, AsyncPipe],
    templateUrl: './experience-card.component.html',
    styleUrls: ['./experience-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceCardComponent {
    private store = inject(Store);

    experienceType = input.required<string>();
    workDescription = input<TWorkExperience | null>(null);
    experienceDescription = input<
        TWorkExperience | TEducationExperience | null
    >(null);
    theme = input<boolean>(false);

    // State signals
    experienceCardImgVisibility = signal(false);

    // Store observables
    public arrowUrl$ = this.store.select(selectArrowUrl).pipe(
        filter((url) => url !== undefined && url !== null),
        map((url) => url),
    );
    public downloadUrl$ = this.store.select(selectDownloadUrl).pipe(
        filter((url) => url !== undefined && url !== null),
        map((url) => url),
    );

    ngOnInit(): void {
        this.initializeComponent();
    }

    // Methods
    onCardHover(isHovered: boolean): void {
        this.experienceCardImgVisibility.set(isHovered);
    }

    showDialogExperience(
        dialogInfo: TWorkExperience | TEducationExperience | null,
    ) {
        if (dialogInfo) {
            this.store.dispatch(
                ExperienceActions.getExperienceDialogOpen({ data: dialogInfo }),
            );
        }
    }

    private initializeComponent(): void {
        const mode = !this.theme();
        this.store.dispatch(ImagesActions.loadArrowIcons({ mode }));
        this.store.dispatch(ImagesActions.loadDownloadIcons({ mode }));
    }
}
