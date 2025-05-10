import { Observable, map, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Inject, input } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { DestroyService } from '@core/service/destroy/destroy.service';

import { darkModeSelector } from '@store/dark-mode-store/dark-mode.selectors';
import { GithubRepositoriesActions } from '@store/github-projects-store/github-projects.action';
import { GithubState } from '@store/github-projects-store/github-projects.reducer';
import { selectRepositoryLanguages } from '@store/github-projects-store/github-projects.selector';

@Component({
    selector: 'cv-project-chips',
    standalone: true,
    imports: [NgClass, AsyncPipe],
    templateUrl: './project-chips.component.html',
    styleUrls: ['./project-chips.component.scss'],
})
export class ProjectChipsComponent {
    public projectChipsText = input.required<string>();
    public repositoryName = input.required<string>();
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    constructor(
        @Inject(Store) private _store$: Store<GithubState>,
        @Inject(DestroyService) private _destroyed$: Observable<void>,
    ) {}

    public onProjectClick(repoName: string): void {
        this._store$.dispatch(
            GithubRepositoriesActions.getRepositoryLanguages({
                repoName,
            }),
        );

        this._store$
            .pipe(takeUntil(this._destroyed$))
            .pipe(select(selectRepositoryLanguages))
            .pipe(map((languages) => languages[repoName]))
            .subscribe((languages) => {
                console.log(`Technologies for ${repoName}:`, languages);
            });
    }
}
