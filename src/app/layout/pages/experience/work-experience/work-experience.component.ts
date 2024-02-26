import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ExperienceCardComponent } from '@layout/components/experience-card/experience-card.component';

@Component({
    selector: 'cv-work-experience',
    standalone: true,
    imports: [ExperienceCardComponent],
    templateUrl: './work-experience.component.html',
    styleUrl: './work-experience.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkExperienceComponent {
    @Input() public selectedTabWork: string = '';
}
