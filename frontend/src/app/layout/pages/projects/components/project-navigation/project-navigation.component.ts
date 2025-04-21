import { Observable } from 'rxjs';

import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Output,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { TGitHub } from '@core/models/github.type';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';

@Component({
    selector: 'cv-project-navigation',
    templateUrl: './project-navigation.component.html',
    styleUrls: ['./project-navigation.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNavigationComponent {
    @Output() repoTypeChanged = new EventEmitter<
        'public' | 'private' | 'all'
    >();

    publicRepositories$!: Observable<TGitHub[]>;
    privateRepositories$!: Observable<TGitHub[]>;
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );
    public currentRepositories$!: Observable<TGitHub[]>;

    constructor(private _store$: Store) {}

    public setRepoType(type: 'public' | 'private' | 'all'): void {
        this.repoTypeChanged.emit(type);
    }
}
