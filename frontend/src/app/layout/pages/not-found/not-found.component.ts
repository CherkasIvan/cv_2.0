import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cv-not-found',
    standalone: true,
    imports: [],
    templateUrl: './not-found.component.html',
    styleUrls: [
        './not-found.component.scss',
        './not-found-dm/not-found-dm.component.scss',
        './not-found-mobile/not-found-mobile.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
