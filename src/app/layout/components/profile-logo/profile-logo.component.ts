import { Observable } from 'rxjs';

import {
    AsyncPipe,
    DOCUMENT,
    NgClass,
    isPlatformBrowser,
    isPlatformServer,
} from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';

import { IDarkMode } from '@app/layout/store/model/dark-mode.interface';

@Component({
    selector: 'cv-profile-logo',
    standalone: true,
    imports: [AsyncPipe, NgClass],
    templateUrl: './profile-logo.component.html',
    styleUrl: './profile-logo.component.scss',
})
export class ProfileLogoComponent implements OnInit {
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    private readonly platform = inject(PLATFORM_ID);
    private readonly document = inject(DOCUMENT);

    constructor(
        @Inject(DOCUMENT)
        private _store$: Store<IDarkMode>,
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platform)) {
            console.warn('browser');
            // Safe to use document, window, localStorage, etc. :-)
            console.log(document);
            this.githubNavigation();
        }

        if (isPlatformServer(this.platform)) {
            console.warn('server');
            // Not smart to use document here, however, we can inject it ;-)
            console.log(this.document);
        }
    }

    githubNavigation() {
        this.document.defaultView?.open(
            'https://github.com/CherkasIvan',
            '_blank',
        );
    }
}
