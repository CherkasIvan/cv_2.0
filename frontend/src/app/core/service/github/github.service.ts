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
    private readonly apiUrl = 'http://localhost:3000/github';
    private token: string | null = null;

    constructor(private httpClient: HttpClient) {}

    // Метод для получения токена
    getToken(): Observable<any> {
        return this.httpClient.get(`${this._baseUrl}/token`);
    }

    // Метод для инициализации токена
    initializeToken(): void {
        this.getToken().subscribe(
            (data) => {
                this.token = data.token;
                console.log('Token:', this.token);
            },
            (error) => {
                console.error('Error fetching token', error);
            },
        );
    }

    // Метод для получения репозиториев
    public getRepositories(): Observable<any> {
        return this.httpClient.get(`${this._baseUrl}/repositories`);
    }

    // Метод для получения публичных репозиториев
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

    // Метод для получения приватных репозиториев
    public getGithubPrivateRepos(
        page: number = 1,
        perPage: number = 100,
    ): Observable<TGitHub[]> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.token}`, // Используем токен
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

    // Метод для получения языков репозитория
    public getRepositoryLanguages(repoName: string): Observable<string[]> {
        return this.httpClient
            .get<{
                [key: string]: number;
            }>(`${this._baseUrl}/repos/CherkasIvan/${repoName}/languages`)
            .pipe(map((languages) => Object.keys(languages)));
    }
}
