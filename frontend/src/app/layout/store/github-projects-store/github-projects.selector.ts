import { createFeatureSelector, createSelector } from '@ngrx/store';

import { GithubState } from './github-projects.reducer';

export const selectRepositoriesState =
    createFeatureSelector<GithubState>('github');

export const selectGithubRepositories = createSelector(
    selectRepositoriesState,
    (state: GithubState) => state.repositories,
);

export const selectRepositoryLanguages = createSelector(
    selectRepositoriesState,
    (state: GithubState) => state.languages,
);
