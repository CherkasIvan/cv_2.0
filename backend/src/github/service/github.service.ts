import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common/decorators';
import { Observable, map, switchMap } from 'rxjs';

@Injectable()
export class GithubService {
  private readonly _baseUrl = 'https://api.github.com';
  private readonly apiUrl = 'http://localhost:3000/github';
  private token: string | null = null;

  constructor(private httpService: HttpService) {}

  // Метод для получения токена
  getToken(): Observable<any> {
    return this.httpService
      .get(`${this.apiUrl}/token`)
      .pipe(map((response: AxiosResponse) => response.data));
  }

  // Метод для инициализации токена
  initializeToken(): Observable<void> {
    return new Observable<void>((observer) => {
      this.getToken().subscribe(
        (data) => {
          this.token = data.token;
          console.log('Token:', this.token); // Проверка токена
          observer.next();
          observer.complete();
        },
        (error) => {
          console.error('Error fetching token', error);
          observer.error(error);
        },
      );
    });
  }

  // Метод для получения приватных репозиториев
  public getGithubPrivateRepos(
    page: number = 1,
    perPage: number = 100,
  ): Observable<any[]> {
    if (!this.token) {
      return this.initializeToken().pipe(
        switchMap(() => this.fetchPrivateRepos(page, perPage)), // Используем switchMap
      );
    } else {
      return this.fetchPrivateRepos(page, perPage);
    }
  }

  private fetchPrivateRepos(page: number, perPage: number): Observable<any[]> {
    const headers = {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/vnd.github.v3+json',
    };

    console.log('Headers:', headers); // Проверка заголовков

    return this.httpService
      .get<any[]>(`${this._baseUrl}/user/repos`, {
        headers,
        params: {
          page: page.toString(),
          per_page: perPage.toString(),
        },
      })
      .pipe(
        map((response: AxiosResponse<any[]>) =>
          response.data.map((repository: any) => ({
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
}
