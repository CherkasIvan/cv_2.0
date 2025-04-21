import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AnimateSsrService {
    constructor(
        private _router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {}

    navigate() {
        if (isPlatformBrowser(this.platformId)) {
            this._router.navigate(['/layout']);
        }
    }
}
