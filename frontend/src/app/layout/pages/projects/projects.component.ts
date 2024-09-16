import { Observable, Subject } from 'rxjs';

import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { TGitHub } from '@core/models/github.type';

import { ButtonComponent } from '@layout/components/button/button.component';
import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { GithubRepositoriesActions } from '@layout/store/github-projects-store/github-projects.action';
import { selectGithubRepositories } from '@layout/store/github-projects-store/github-projects.selector';
import { IDarkMode } from '@layout/store/model/dark-mode.interface';

import { ProjectChipsComponent } from './components/project-chips/project-chips.component';

@Component({
    selector: 'cv-projects',
    standalone: true,
    imports: [
        AsyncPipe,
        NgClass,
        DatePipe,
        ProjectChipsComponent,
        ButtonComponent,
    ],
    templateUrl: './projects.component.html',
    styleUrls: [
        './projects.component.scss',
        './projects-dm/projects-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
    public githubRepos$: Observable<TGitHub[]> = this._store$.pipe(
        select(selectGithubRepositories),
    );
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
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

    constructor(private _store$: Store<TGitHub[] | IDarkMode>) {}

    ngOnInit(): void {
        this._store$.dispatch(GithubRepositoriesActions.getRepositories());
    }
}
