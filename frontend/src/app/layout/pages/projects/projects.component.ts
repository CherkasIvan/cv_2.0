import { Observable, combineLatestWith, map } from 'rxjs';

import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { TGitHub } from '@core/models/github.type';

import { ButtonComponent } from '@layout/components/button/button.component';

import { TranslateModule } from '@ngx-translate/core';
import { darkModeSelector } from '@store/dark-mode-store/dark-mode.selectors';
import { GithubRepositoriesActions } from '@store/github-projects-store/github-projects.action';
import {
    selectFilteredPrivateRepositories,
    selectFilteredPublicRepositories,
} from '@store/github-projects-store/github-projects.selector';
import { TDarkMode } from '@store/model/dark-mode.type';

import { ProjectChipsComponent } from './components/project-chips/project-chips.component';
import { ProjectNavigationComponent } from './components/project-navigation/project-navigation.component';

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
        ProjectNavigationComponent,
    ],
    templateUrl: './projects.component.html',
    styleUrls: [
        './projects.component.scss',
        './projects-dm/projects-dm.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
    publicRepositories$!: Observable<TGitHub[]>;
    privateRepositories$!: Observable<TGitHub[]>;
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );
    public currentRepositories$!: Observable<TGitHub[]>;

    constructor(@Inject(Store) private _store$: Store<TGitHub[] | TDarkMode>) {}

    ngOnInit(): void {
        this._store$.dispatch(
            GithubRepositoriesActions.getPublicRepositories(),
        );
        this._store$.dispatch(
            GithubRepositoriesActions.getPrivateRepositories(),
        );

        this.publicRepositories$ = this._store$.select(
            selectFilteredPublicRepositories,
        );
        this.privateRepositories$ = this._store$.select(
            selectFilteredPrivateRepositories,
        );

        this.currentRepositories$ = this.publicRepositories$;
    }

    public setRepoType(type: 'public' | 'private' | 'all'): void {
        if (type === 'public') {
            this.currentRepositories$ = this.publicRepositories$;
        } else if (type === 'private') {
            this.currentRepositories$ = this.privateRepositories$;
        } else if (type === 'all') {
            this.currentRepositories$ = this.publicRepositories$.pipe(
                combineLatestWith(this.privateRepositories$),
                map(([publicRepos, privateRepos]) => {
                    const allRepos = [...publicRepos, ...privateRepos];
                    return this.shuffleRepos(allRepos);
                }),
            );
        }
    }

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

    private shuffleRepos<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Перемешивание
        }
        return array;
    }
}
