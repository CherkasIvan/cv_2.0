import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    PLATFORM_ID,
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
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformServer(this.platformId)) {
            console.log('App is running in SSR mode');
        }
        if (isPlatformBrowser(this.platformId)) {
            console.log('App is running in browser mode');
        }
    }
}
