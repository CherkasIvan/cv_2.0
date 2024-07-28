import { Observable } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';

import { TExperienceAside } from '@core/models/experience-aside.type';
import { ITechnologies } from '@core/models/technologies.interface';
import { FirebaseService } from '@core/service/firebase/firebase.service';

import { EvenColumnDirective } from '@app/core/directives/even-column.directive';
import { AsideNavigationComponent } from '@app/layout/components/aside-navigation/aside-navigation.component';

import { TechnologyCardComponent } from './components/technology-card/technology-card.component';

@Component({
    selector: 'cv-technologies',
    standalone: true,
    imports: [
        AsideNavigationComponent,
        TechnologyCardComponent,
        AsyncPipe,
        NgClass,
        EvenColumnDirective,
    ],
    templateUrl: './technologies.component.html',
    styleUrl: './technologies.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologiesComponent implements OnInit {
    public selectedTab: string = '';

    public technologiesAside: TExperienceAside[] = [
        { id: 1, title: 'Технические навыки', value: 'tech' },
        { id: 2, title: 'Остальные навыки', value: 'other' },
    ];
    public currentTechnologiesStack: ITechnologies[] = [];

    public backendTech$: Observable<ITechnologies[]> =
        this._firebaseService.getBackendTech();

    public otherTech$: Observable<ITechnologies[]> =
        this._firebaseService.getOtherTech();

    public frontendTech$: Observable<ITechnologies[]> =
        this._firebaseService.getFrontendTech();

    public technologiesSwitcher(tab: string): void {
        switch (tab) {
            case 'other':
                this.otherTech$.subscribe((tech) => {
                    if (tech) {
                        this.currentTechnologiesStack = tech;
                        this._cdr.markForCheck();
                    }
                });
                break;
            case 'front':
                this.frontendTech$.subscribe((tech) => {
                    if (tech) {
                        this.currentTechnologiesStack = tech;
                        this._cdr.markForCheck();
                    }
                });
                break;
            case 'back':
                this.backendTech$.subscribe((tech) => {
                    if (tech) {
                        this.currentTechnologiesStack = tech;
                        this._cdr.markForCheck();
                    }
                });
                break;
        }
    }

    public switchTab($event: string) {
        this.selectedTab = $event;
        this.technologiesSwitcher(this.selectedTab);
    }

    constructor(
        private _firebaseService: FirebaseService,
        private _cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.technologiesSwitcher(this.selectedTab);
    }
}
