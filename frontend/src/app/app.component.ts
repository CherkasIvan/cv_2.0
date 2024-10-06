import { Subject, takeUntil } from 'rxjs';

import {
    ApplicationRef,
    ChangeDetectionStrategy,
    Component,
    NgZone,
    OnDestroy,
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
export class AppComponent implements OnDestroy {
    title = 'cv_2.0';

    private ngZone = inject(NgZone);
    private _destroyed$: Subject<void> = new Subject();

    constructor() {
        const ngZone = ɵglobal.Zone;
        const TaskTrackingZone =
            ngZone.current._parent?._properties?.TaskTrackingZone;

        if (!TaskTrackingZone) {
            return;
        }

        inject(ApplicationRef)
            .isStable.pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                this.printNgZone(TaskTrackingZone, 0);
            });

        this.printNgZone(TaskTrackingZone, 2000);
    }

    private printNgZone(zone: any, delay: number): void {
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                console.debug('👀 Pending tasks in NgZone: 👀');
                console.debug({
                    microTasks: zone.getTasksFor('microTask'),
                    macroTasks: zone.getTasksFor('macroTask'),
                    eventTasks: zone.getTasksFor('eventTask'),
                });
            }, delay);
        });
    }

    ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
