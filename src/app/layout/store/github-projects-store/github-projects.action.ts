import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { TGitHub } from '@app/core/models/github.type';

export const GithubRespositoriesActions = createActionGroup({
    source: 'Repositories',
    events: {
        getRepositories: emptyProps(),
        getRepositoriesSuccess: props<{ repositories: TGitHub[] }>(),
        getRepositoriesError: props<{ error: unknown }>(),
    },
});
