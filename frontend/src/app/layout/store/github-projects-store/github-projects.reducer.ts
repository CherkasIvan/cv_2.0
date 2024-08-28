import { createReducer, on } from '@ngrx/store';

import { TGitHub } from '@core/models/github.type';

import { GithubRepositoriesActions } from './github-projects.action';

export const githubState: TGitHub[] = [];

export const githubRepositoriesReducer = createReducer(
    githubState,
    on(
        GithubRepositoriesActions.getRepositoriesSuccess,
        (state, { repositories }) => [...repositories],
    ),
    on(GithubRepositoriesActions.getRepositoriesError, (state, { error }) => ({
        ...state,
        error,
    })),
);
