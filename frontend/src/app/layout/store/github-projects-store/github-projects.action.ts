import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { TGitHub } from '@core/models/github.type';

export const GithubRepositoriesActions = createActionGroup({
    source: 'Repositories',
    events: {
        getPublicRepositories: emptyProps(),
        getPublicRepositoriesSuccess: props<{ repositories: TGitHub[] }>(),
        getPublicRepositoriesError: props<{ error: unknown }>(),

        getPrivateRepositories: emptyProps(),
        getPrivateRepositoriesSuccess: props<{ repositories: TGitHub[] }>(),
        getPrivateRepositoriesError: props<{ error: unknown }>(),

        getRepositoryLanguages: props<{ repoName: string }>(),
        getRepositoryLanguagesSuccess: props<{
            repoName: string;
            languages: string[];
        }>(),
        getRepositoryLanguagesError: props<{ error: unknown }>(),
    },
});
