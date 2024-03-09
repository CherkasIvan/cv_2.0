import { Observable } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
} from '@angular/core';

import { ITechnologies } from '@core/models/technologies.interface';
import { FirebaseService } from '@core/service/firebase/firebase.service';

import { AsideNavigationComponent } from '@layout/components/aside-navigation/aside-navigation.component';

import { TExperienceAside } from '@app/core/models/experience-aside.type';

import { TechnologyCardComponent } from './components/technology-card/technology-card.component';

@Component({
    selector: 'cv-technologies',
    standalone: true,
    imports: [AsideNavigationComponent, TechnologyCardComponent, AsyncPipe],
    templateUrl: './technologies.component.html',
    styleUrl: './technologies.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologiesComponent {
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
        console.log(tab);
        switch (tab) {
            case 'other':
                this.otherTech$.subscribe((tech) => {
                    if (tech) {
                        this.currentTechnologiesStack = tech;
                        this.cdr.markForCheck();
                    }
                });
                break;
            case 'front':
                this.frontendTech$.subscribe((tech) => {
                    if (tech) {
                        this.currentTechnologiesStack = tech;
                        this.cdr.markForCheck();
                    }
                });
                break;
            case 'back':
                this.backendTech$.subscribe((tech) => {
                    if (tech) {
                        this.currentTechnologiesStack = tech;
                        this.cdr.markForCheck();
                    }
                });
                break;
        }
    }

    public switch(e: any) {
        console.log(e);
    }

    public switchTab($event: string) {
        this.selectedTab = $event;
        this.technologiesSwitcher(this.selectedTab);
        console.log(this.selectedTab);
    }

    constructor(
        private _firebaseService: FirebaseService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.technologiesSwitcher(this.selectedTab);
        console.log(this.selectedTab);
    }
}
