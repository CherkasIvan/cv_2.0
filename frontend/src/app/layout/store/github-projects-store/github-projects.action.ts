import { TGitHubMapped } from '@core/models/github-mapped.type';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GithubRepositoriesActions = createActionGroup({
    source: 'Repositories',
    events: {
        getRepositories: emptyProps(),
        getRepositoriesSuccess: props<{ repositories: TGitHubMapped[] }>(),
        getRepositoriesError: props<{ error: unknown }>(),
        getRepositoryLanguages: props<{ repoName: string }>(),
        getRepositoryLanguagesSuccess: props<{
            repoName: string;
            languages: string[];
        }>(),
        getRepositoryLanguagesError: props<{ error: unknown }>(),
    },
});
