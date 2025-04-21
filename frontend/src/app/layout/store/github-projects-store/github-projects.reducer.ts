import { createReducer, on } from '@ngrx/store';

import { TGitHub } from '@core/models/github.type';

import { GithubRepositoriesActions } from './github-projects.action';

export interface GithubState {
    publicRepositories: TGitHub[];
    privateRepositories: TGitHub[];
    languages: { [repoName: string]: string[] };
    error?: unknown;
}

export const initialGithubState: GithubState = {
    publicRepositories: [],
    privateRepositories: [],
    languages: {},
};

export const githubRepositoriesReducer = createReducer(
    initialGithubState,
    on(
        GithubRepositoriesActions.getPublicRepositoriesSuccess,
        (state, { repositories }) => ({
            ...state,
            publicRepositories: repositories,
        }),
    ),
    on(
        GithubRepositoriesActions.getPublicRepositoriesError,
        (state, { error }) => ({
            ...state,
            error,
        }),
    ),

    on(
        GithubRepositoriesActions.getPrivateRepositoriesSuccess,
        (state, { repositories }) => ({
            ...state,
            privateRepositories: repositories,
        }),
    ),
    on(
        GithubRepositoriesActions.getPrivateRepositoriesError,
        (state, { error }) => ({
            ...state,
            error,
        }),
    ),

    on(
        GithubRepositoriesActions.getRepositoryLanguagesSuccess,
        (state, { repoName, languages }) => ({
            ...state,
            languages: { ...state.languages, [repoName]: languages },
        }),
    ),
    on(
        GithubRepositoriesActions.getRepositoryLanguagesError,
        (state, { error }) => ({
            ...state,
            error,
        }),
    ),
);
