import { Observable } from 'rxjs';

import { AsyncPipe, DOCUMENT, NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { darkModeSelector } from '@app/layout/store/dark-mode-store/dark-mode.selectors';

@Component({
    selector: 'cv-profile-logo',
    standalone: true,
    imports: [AsyncPipe, NgClass],
    templateUrl: './profile-logo.component.html',
    styleUrl: './profile-logo.component.scss',
})
export class ProfileLogoComponent {
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private _store$: Store,
    ) {}

    githubNavigation() {
        this.document.defaultView?.open(
            'https://github.com/CherkasIvan',
            '_blank',
        );
    }
}
