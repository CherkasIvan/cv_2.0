import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TGitHub } from '@app/core/models/github.type';

export const selectRepositoriesState =
    createFeatureSelector<TGitHub[]>('github');

export const selectGithubRepositories = createSelector(
    selectRepositoriesState,
    (state: TGitHub[]) => state,
);
