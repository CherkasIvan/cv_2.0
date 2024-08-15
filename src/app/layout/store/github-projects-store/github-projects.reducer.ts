import { createReducer, on } from '@ngrx/store';

import { TGitHub } from '@core/models/github.type';

import { GithubRespositoriesActions } from './github-projects.action';

export const githubState: TGitHub[] = [];

export const githubRepositoriesReducer = createReducer(
    githubState,
    on(
        GithubRespositoriesActions.getRepositoriesSuccess,
        (state, { repositories }) => [...repositories],
    ),
    on(GithubRespositoriesActions.getRepositoriesError, (state, { error }) => ({
        ...state,
        error,
    })),
);
