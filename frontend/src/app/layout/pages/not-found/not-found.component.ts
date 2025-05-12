import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cv-not-found',
    standalone: true,
    imports: [],
    templateUrl: './not-found.component.html',
    styleUrls: [
        './styles/not-found.component.scss',
        './styles/not-found-dm.component.scss',
        './styles/not-found-mobile.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
