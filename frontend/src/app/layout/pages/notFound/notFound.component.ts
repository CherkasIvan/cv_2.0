import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cv-not-found',
    standalone: true,
    imports: [],
    templateUrl: './notFound.component.html',
    styleUrl: './notFound.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
