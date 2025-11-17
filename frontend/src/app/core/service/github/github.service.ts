import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TGitHubRepository } from '@core/models/github-repository.type';
import { TGitHubMapped } from '@core/models/github-mapped.type';

@Injectable({
    providedIn: 'root',
})
export class GithubService {
    constructor(private httpClient: HttpClient) {}

    public getGithubRepos(): Observable<TGitHubMapped[]> {
        return this.httpClient
            .get<
                TGitHubRepository[]
            >('https://api.github.com/users/CherkasIvan/repos')
            .pipe(
                map((repositories: TGitHubRepository[]) =>
                    repositories.map(
                        (repository: TGitHubRepository) =>
                            <TGitHubMapped>{
                                name: repository.name,
                                stars: repository.stargazers_count,
                                htmlUrl: repository.html_url,
                                forks: repository.forks,
                                created_at: repository.created_at,
                                updated_at: repository.updated_at,
                                description: repository.description,
                            },
                    ),
                ),
            );
    }

    public getRepositoryLanguages(repoName: string): Observable<string[]> {
        return this.httpClient
            .get<{
                [key: string]: number;
            }>(`https://api.github.com/repos/CherkasIvan/${repoName}/languages`)
            .pipe(map((languages) => Object.keys(languages)));
    }
}
