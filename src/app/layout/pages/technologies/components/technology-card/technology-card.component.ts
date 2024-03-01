import { Component, Input } from '@angular/core';

import { ITechnologies } from '@app/core/models/technologies.interface';

@Component({
    selector: 'cv-technology-card',
    standalone: true,
    imports: [],
    templateUrl: './technology-card.component.html',
    styleUrl: './technology-card.component.scss',
})
export class TechnologyCardComponent {
    @Input() public technologyItem: ITechnologies | null = null;
    ngOnInit(){
      console.log(this.technologyItem)
    }
}
