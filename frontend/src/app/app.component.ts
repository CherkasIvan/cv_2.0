import { isPlatformBrowser } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    PLATFORM_ID,
    inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppStateService } from '@core/service/app-state/app-state.service';

@Component({
    selector: 'cv-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    private _platformId = inject(PLATFORM_ID);

    constructor(private appStateService: AppStateService) {}
    async ngOnInit() {
        if (isPlatformBrowser(this._platformId)) {
            const state = await this.appStateService.getState('userState');
            if (!state) {
                this.appStateService.saveState('userState', {});
            }
        }
    }
}
