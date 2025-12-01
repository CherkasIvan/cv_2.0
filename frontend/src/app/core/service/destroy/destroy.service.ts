import { ReplaySubject } from 'rxjs';

import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DestroyService extends ReplaySubject<void> implements OnDestroy {
    constructor() {
        super();
    }

    ngOnDestroy() {
        this.next();
        this.complete();
    }
}
