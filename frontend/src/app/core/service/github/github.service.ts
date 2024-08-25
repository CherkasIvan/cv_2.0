import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IGitHubRepository } from '@core/models/github-repository.interface';
import { TGitHub } from '@core/models/github.type';

@Injectable({
    providedIn: 'root',
})
export class GithubService {
    constructor(private httpClient: HttpClient) {}

    public getGithubRepos(): Observable<TGitHub[]> {
        return this.httpClient
            .get<
                IGitHubRepository[]
            >('https://api.github.com/users/CherkasIvan/repos')
            .pipe(
                map((repositories: IGitHubRepository[]) =>
                    repositories.map(
                        (repository: IGitHubRepository) =>
                            <TGitHub>{
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
}
