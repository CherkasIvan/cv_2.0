import { isPlatformServer } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    PLATFORM_ID,
    afterNextRender,
    inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    title = 'cv_2.0';
    platformId = inject(PLATFORM_ID);

    constructor() {
        afterNextRender(() => {
            console.log('server');
            console.log(this.platformId);
            console.log(this.platformId);
            console.log(this.platformId);
        });
    }
}
