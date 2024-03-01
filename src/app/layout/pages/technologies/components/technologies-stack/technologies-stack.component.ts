import { Observable } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ITechnologies } from '@app/core/models/technologies.interface';
import { FirebaseService } from '@app/core/service/firebase/firebase.service';

import { TechnologyCardComponent } from '../technology-card/technology-card.component';

@Component({
    selector: 'cv-technologies-stack',
    standalone: true,
    imports: [TechnologyCardComponent, AsyncPipe],
    templateUrl: './technologies-stack.component.html',
    styleUrl: './technologies-stack.component.scss',
})
export class TechnologiesStackComponent {
    @Input() public currentTab: string = '';
    public backendTech$: Observable<ITechnologies[]> =
        this._firebaseService.getBackendTech();

    constructor(private _firebaseService: FirebaseService) {}
}
