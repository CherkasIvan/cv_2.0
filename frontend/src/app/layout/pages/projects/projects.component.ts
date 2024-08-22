import { Observable, Subject, takeUntil } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { TGitHub } from '@app/core/models/github.type';
import { GithubRespositoriesActions } from '@app/layout/store/github-projects-store/github-projects.action';
import { selectGithubRepositories } from '@app/layout/store/github-projects-store/github-projects.selector';

@Component({
    selector: 'cv-projects',
    standalone: true,
    imports: [AsyncPipe, NgClass],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
    public githubRepos$: Observable<TGitHub[]> = this._store$.pipe(
        select(selectGithubRepositories),
    );

    public getClass(index: number): string {
        const row = Math.floor(index / 3);
        const position = index % 3;
        if (row % 2 === 0) {
            if (position === 0) return 'item1';
            if (position === 1) return 'item2';
            if (position === 2) return 'item3';
        } else {
            if (position === 0) return 'item4';
            if (position === 1) return 'item5';
            if (position === 2) return 'item6';
        }
        return '';
    }

    private _destroyed$: Subject<void> = new Subject();

    constructor(private _store$: Store<TGitHub[]>) {}

    ngOnInit(): void {
        this._store$.dispatch(GithubRespositoriesActions.getRepositories());
    }
}
