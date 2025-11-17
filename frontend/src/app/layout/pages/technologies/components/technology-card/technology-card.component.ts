import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    signal,
    computed
} from '@angular/core';
import { TBackendTechnologies } from '@core/models/backend-technologies.type';
import { TFrontendTechnologies } from '@core/models/frontend-technologies.type';
import { TOtherTechnologies } from '@core/models/other-technologies.type';

@Component({
    selector: 'cv-technology-card',
    standalone: true,
    imports: [NgClass],
    templateUrl: './technology-card.component.html',
    styleUrls: [
        './technology-card.component.scss',
        './technology-card-dm/technology-card-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologyCardComponent {
    public technologyItem = input.required<TBackendTechnologies | TFrontendTechnologies | TOtherTechnologies | null>();
    public theme = input<boolean | null>();
    public animationDelay = input<number>(0);
    public isImageLoaded = signal(false);

    public cardStyles = computed(() => ({
        '--animation-delay': `${this.animationDelay()}ms`
    }));

    public onImageLoad() {
        setTimeout(() => {
            this.isImageLoaded.set(true);
        }, 50);
    }
}