import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TGitHub } from '@core/models/github.type';

import { GithubState } from './github-projects.reducer';

export const selectRepositoriesState =
    createFeatureSelector<GithubState>('github');

export const selectPublicRepositories = createSelector(
    selectRepositoriesState,
    (state: GithubState) => state.publicRepositories,
);

export const selectPrivateRepositories = createSelector(
    selectRepositoriesState,
    (state: GithubState) => state.privateRepositories,
);

export const selectFilteredPublicRepositories = createSelector(
    selectPublicRepositories,
    (repositories: TGitHub[]) => repositories.filter((repo) => !repo.private),
);

export const selectFilteredPrivateRepositories = createSelector(
    selectPrivateRepositories,
    (repositories: TGitHub[]) => repositories.filter((repo) => repo.private),
);

export const selectRepositoryLanguages = createSelector(
    selectRepositoriesState,
    (state: GithubState) => state.languages,
);
