import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cv-not-found',
    standalone: true,
    imports: [],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
