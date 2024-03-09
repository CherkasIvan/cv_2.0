import { Component, Input, input } from '@angular/core';

import { ITechnologies } from '@core/models/technologies.interface';

@Component({
    selector: 'cv-technology-card',
    standalone: true,
    imports: [],
    templateUrl: './technology-card.component.html',
    styleUrl: './technology-card.component.scss',
})
export class TechnologyCardComponent {
    public technologyItem = input.required<ITechnologies | null>();
}
