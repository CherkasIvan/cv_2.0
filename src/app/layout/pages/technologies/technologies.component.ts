import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AsideNavigationComponent } from '@layout/components/aside-navigation/aside-navigation.component';

import { TechnologiesStackComponent } from './components/technologies-stack/technologies-stack.component';

@Component({
    selector: 'cv-technologies',
    standalone: true,
    imports: [AsideNavigationComponent, TechnologiesStackComponent],
    templateUrl: './technologies.component.html',
    styleUrl: './technologies.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologiesComponent {
    public technologiesAside: any = [
        { id: 1, title: 'Технические навыки', value: 'tech' },
        { id: 2, title: 'Остальные навыки', value: 'other' },
    ];

    public selectedTab: string = '';

    public switchTab($event: string) {
        this.selectedTab = $event;
    }
}
