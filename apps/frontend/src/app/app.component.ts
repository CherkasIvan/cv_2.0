import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
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
export class AppComponent implements OnInit {
    private _platformId = inject(PLATFORM_ID);
    private appStateService = inject(AppStateService);

    platform: string = 'unknown';
    userAgent: string = 'unknown';
    showDebug: boolean = false;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {}

    async ngOnInit() {
        // Ваш существующий код инициализации
        if (isPlatformBrowser(this.platformId)) {
            this.platform = 'browser';
            this.userAgent = navigator.userAgent;
        } else if (isPlatformServer(this.platformId)) {
            this.platform = 'server';
        }
    }
}
