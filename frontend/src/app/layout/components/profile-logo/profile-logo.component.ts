import { Observable, switchMap } from 'rxjs';

import { AsyncPipe, DOCUMENT, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { ImagesActions } from '@layout/store/images-store/images.actions';
import { selectProfileImageUrl } from '@layout/store/images-store/images.selectors';

@Component({
    selector: 'cv-profile-logo',
    standalone: true,
    imports: [AsyncPipe, NgClass],
    templateUrl: './profile-logo.component.html',
    styleUrls: ['./profile-logo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileLogoComponent {
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );
    public profileImageUrl$: Observable<string | undefined>;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(Store) private _store$: Store,
    ) {
        this.profileImageUrl$ = this.currentTheme$.pipe(
            switchMap((isDarkMode) => {
                const mode = !isDarkMode;
                this._store$.dispatch(ImagesActions.getProfileImg({ mode }));
                return this._store$.pipe(select(selectProfileImageUrl));
            }),
        );
    }

    public githubNavigation() {
        this.document.defaultView?.open(
            'https://github.com/CherkasIvan',
            '_blank',
        );
    }
}
