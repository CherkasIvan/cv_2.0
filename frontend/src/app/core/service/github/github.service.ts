import { Observable, map } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IGitHubRepository } from '@core/models/github-repository.interface';
import { TGitHub } from '@core/models/github.type';

import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class GithubService {
    private readonly _baseUrl = 'https://api.github.com';

    constructor(private httpClient: HttpClient) {}

    public getGithubPublicRepos(
        page: number = 1,
        perPage: number = 100,
    ): Observable<TGitHub[]> {
        return this.httpClient
            .get<IGitHubRepository[]>(
                `${this._baseUrl}/users/CherkasIvan/repos`,
                {
                    params: {
                        page: page.toString(),
                        per_page: perPage.toString(),
                    },
                },
            )
            .pipe(
                map((repositories: IGitHubRepository[]) =>
                    repositories.map((repository: IGitHubRepository) => ({
                        name: repository.name,
                        stars: repository.stargazers_count,
                        htmlUrl: repository.html_url,
                        forks: repository.forks,
                        created_at: repository.created_at,
                        updated_at: repository.updated_at,
                        description: repository.description,
                        private: repository.private,
                    })),
                ),
            );
    }

    public getGithubPrivateRepos(
        page: number = 1,
        perPage: number = 100,
    ): Observable<TGitHub[]> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${environment.githubToken}`, // Используйте токен из окружения
            Accept: 'application/vnd.github.v3+json',
        });

        return this.httpClient
            .get<IGitHubRepository[]>(`${this._baseUrl}/user/repos`, {
                headers,
                params: {
                    page: page.toString(),
                    per_page: perPage.toString(),
                },
            })
            .pipe(
                map((repositories: IGitHubRepository[]) =>
                    repositories.map((repository: IGitHubRepository) => ({
                        name: repository.name,
                        stars: repository.stargazers_count,
                        htmlUrl: repository.html_url,
                        forks: repository.forks,
                        created_at: repository.created_at,
                        updated_at: repository.updated_at,
                        description: repository.description,
                        private: repository.private,
                    })),
                ),
            );
    }

    public getRepositoryLanguages(repoName: string): Observable<string[]> {
        return this.httpClient
            .get<{
                [key: string]: number;
            }>(`${this._baseUrl}/repos/CherkasIvan/${repoName}/languages`)
            .pipe(map((languages) => Object.keys(languages)));
    }
}
