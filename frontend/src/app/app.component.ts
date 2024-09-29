import {
    ApplicationRef,
    ChangeDetectionStrategy,
    Component,
    NgZone,
    inject,
    ɵglobal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'cv-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    title = 'cv_2.0';

    private ngZone = inject(NgZone);

    constructor() {
        const ngZone = ɵglobal.Zone;
        const TaskTrackingZone =
            ngZone.current._parent?._properties?.TaskTrackingZone;

        if (!TaskTrackingZone) {
            return;
        }

        inject(ApplicationRef).isStable.subscribe(() => {
            this.printNgZone(TaskTrackingZone, 0);
        });

        this.printNgZone(TaskTrackingZone, 2000);
    }

    private printNgZone(zone: any, delay: number): void {
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                // Print to the console all pending tasks
                // (micro tasks, macro tasks and event listeners):
                console.debug('👀 Pending tasks in NgZone: 👀');
                console.debug({
                    microTasks: zone.getTasksFor('microTask'),
                    macroTasks: zone.getTasksFor('macroTask'),
                    eventTasks: zone.getTasksFor('eventTask'),
                });

                // Advice how to find the origin of Zone tasks:
                // console.debug(
                //   👀 For every pending Zone Task listed above investigate the stacktrace in the property 'creationLocation' 👆
                // );
            }, delay);
        });
    }
}
