import { AsyncPipe, NgClass } from '@angular/common';
import { Component, DestroyRef, Inject, inject, input } from '@angular/core';

import { Observable, map, takeUntil } from 'rxjs';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { GithubRepositoriesActions } from '@layout/store/github-projects-store/github-projects.action';
import { GithubState } from '@layout/store/github-projects-store/github-projects.reducer';
import { selectRepositoryLanguages } from '@layout/store/github-projects-store/github-projects.selector';
import { Store, select } from '@ngrx/store';

@Component({
    selector: 'cv-project-chips',
    standalone: true,
    imports: [NgClass, AsyncPipe],
    templateUrl: './project-chips.component.html',
    styleUrls: ['./project-chips.component.scss'],
})
export class ProjectChipsComponent {
    private _store$ = inject(Store<GithubState>);
    private _destroyRef = inject(DestroyRef);

    public projectChipsText = input.required<string>();
    public repositoryName = input.required<string>();
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    public onProjectClick(repoName: string): void {
        this._store$.dispatch(
            GithubRepositoriesActions.getRepositoryLanguages({
                repoName,
            }),
        );

        this._store$
            .pipe(takeUntil(this._destroyRef))
            .pipe(select(selectRepositoryLanguages))
            .pipe(map((languages) => languages[repoName]))
            .subscribe((languages) => {
                console.log(`Technologies for ${repoName}:`, languages);
            });
    }
}
