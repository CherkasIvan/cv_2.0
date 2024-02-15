import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cv-projects',
    standalone: true,
    imports: [],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {}
