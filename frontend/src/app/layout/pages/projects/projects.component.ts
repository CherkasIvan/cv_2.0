import { Observable } from 'rxjs';

import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { ButtonComponent } from '@layout/components/button/button.component';
import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { GithubRepositoriesActions } from '@layout/store/github-projects-store/github-projects.action';
import { selectGithubRepositories } from '@layout/store/github-projects-store/github-projects.selector';
import { TDarkMode } from '@layout/store/model/dark-mode.type';

import { TranslateModule } from '@ngx-translate/core';

import { ProjectChipsComponent } from './components/project-chips/project-chips.component';
import { TGitHubMapped } from '@core/models/github-mapped.type';

@Component({
    selector: 'cv-projects',
    standalone: true,
    imports: [
        AsyncPipe,
        NgClass,
        DatePipe,
        ProjectChipsComponent,
        ButtonComponent,
        TranslateModule,
    ],
    templateUrl: './projects.component.html',
    styleUrls: [
        './projects.component.scss',
        './projects-dm/projects-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
    public githubRepos$: Observable<TGitHubMapped[]> = this._store$.pipe(
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

    constructor(@Inject(Store) private _store$: Store<TGitHubMapped[] | TDarkMode>) {}

    ngOnInit(): void {
        this._store$.dispatch(GithubRepositoriesActions.getRepositories());
    }
}
