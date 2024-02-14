import {
    Injectable,
    PLATFORM_ID,
    afterNextRender,
    inject,
} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PlatformService {
    isBrowser = true;
    platformId = inject(PLATFORM_ID);

    constructor() {
        afterNextRender(() => {
            this.platformId === 'browser' ? this.isBrowser : !this.isBrowser;
            console.log(this.platformId);
        });
    }

    isPlatformBrowser() {
        return this.isBrowser;
    }
}
