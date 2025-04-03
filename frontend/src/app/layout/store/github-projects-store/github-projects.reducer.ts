import { createReducer, on } from '@ngrx/store';

import { TGitHub } from '@core/models/github.type';

import { GithubRepositoriesActions } from './github-projects.action';

export interface GithubState {
    repositories: TGitHub[];
    languages: { [repoName: string]: string[] };
    error?: unknown;
}

export const githubState: GithubState = {
    repositories: [],
    languages: {},
};

export const githubRepositoriesReducer = createReducer(
    githubState,
    on(
        GithubRepositoriesActions.getRepositoriesSuccess,
        (state, { repositories }) => ({ ...state, repositories }),
    ),
    on(
        GithubRepositoriesActions.getRepositoryLanguagesSuccess,
        (state, { repoName, languages }) => ({
            ...state,
            languages: { ...state.languages, [repoName]: languages },
        }),
    ),
    on(
        GithubRepositoriesActions.getRepositoriesError,
        GithubRepositoriesActions.getRepositoryLanguagesError,
        (state, { error }) => ({ ...state, error }),
    ),
);
