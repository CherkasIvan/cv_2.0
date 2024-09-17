import { Observable } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { IDarkMode } from '@layout/store/model/dark-mode.interface';

@Component({
    selector: 'cv-project-chips',
    standalone: true,
    imports: [NgClass, AsyncPipe],
    templateUrl: './project-chips.component.html',
    styleUrl: './project-chips.component.scss',
})
export class ProjectChipsComponent {
    public projectChipsText = input.required<string>();
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    constructor(private _store$: Store<IDarkMode>) {}
}
