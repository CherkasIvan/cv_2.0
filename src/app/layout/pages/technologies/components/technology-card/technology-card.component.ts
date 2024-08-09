import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ITechnologies } from '@core/models/technologies.interface';

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
    public technologyItem = input.required<ITechnologies | null>();
    public theme = input<boolean | null>();
}
