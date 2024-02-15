import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cv-main',
    standalone: true,
    imports: [],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {}
