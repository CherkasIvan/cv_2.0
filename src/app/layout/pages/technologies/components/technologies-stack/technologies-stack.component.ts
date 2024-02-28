import { Component } from '@angular/core';

import { TechnologyCardComponent } from '../technology-card/technology-card.component';

@Component({
    selector: 'cv-technologies-stack',
    standalone: true,
    imports: [TechnologyCardComponent],
    templateUrl: './technologies-stack.component.html',
    styleUrl: './technologies-stack.component.scss',
})
export class TechnologiesStackComponent {}
