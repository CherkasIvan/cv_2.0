import { Observable, map, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TExperienceAside } from '@core/models/experience-aside.type';
import { IExperience } from '@core/models/experience.interface';
import { IMainPageInfo } from '@core/models/main-page-info';
import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { ITechnologies } from '@core/models/technologies.interface';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) {}

    getBackendTech(): Observable<ITechnologies[]> {
        return this.http.get<ITechnologies[]>(
            `${this.baseUrl}/firebase/backend`,
        );
    }

    getFrontendTech(): Observable<ITechnologies[]> {
        return this.http.get<ITechnologies[]>(
            `${this.baseUrl}/firebase/frontend`,
        );
    }

    getOtherTech(): Observable<ITechnologies[]> {
        return this.http.get<ITechnologies[]>(`${this.baseUrl}/firebase/other`);
    }

    getNavigation(): Observable<INavigation[]> {
        return this.http.get<INavigation[]>(
            `${this.baseUrl}/firebase/navigation`,
        );
    }

    getSocialMediaLinks(): Observable<ISocialMedia[]> {
        return this.http.get<ISocialMedia[]>(
            `${this.baseUrl}/firebase/social-media-links`,
        );
    }

    getHardSkillsNav(): Observable<INavigation[]> {
        return this.http.get<INavigation[]>(
            `${this.baseUrl}/firebase/hard-skills-nav`,
        );
    }

    getWorkExperience(): Observable<IExperience[]> {
        return this.http.get<IExperience[]>(
            `${this.baseUrl}/firebase/work-experience`,
        );
    }

    getMainPageInfo(): Observable<IMainPageInfo> {
        return this.http
            .get<IMainPageInfo[]>(`${this.baseUrl}/firebase/main-page-info`)
            .pipe(map((data) => data[0]));
    }

    getEducationPlaces(): Observable<IExperience[]> {
        return this.http.get<IExperience[]>(
            `${this.baseUrl}/firebase/education-places`,
        );
    }

    getTechnologiesAside(): Observable<TTechnologiesAside[]> {
        return this.http.get<TTechnologiesAside[]>(
            `${this.baseUrl}/firebase/technologies-aside`,
        );
    }

    getExperienceAside(): Observable<TExperienceAside[]> {
        return this.http.get<TExperienceAside[]>(
            `${this.baseUrl}/firebase/experience-aside`,
        );
    }

    getThemelessPicturesImages(): Observable<any> {
        return this.http.get<any[]>(
            `${this.baseUrl}/firebase/themeless-pictures`,
        );
    }

    getIconsWhiteMode(): Observable<string[]> {
        return this.http.get<string[]>('/firebase/wm-pictures');
    }

    getIconsDarkMode(): Observable<string[]> {
        return this.http.get<string[]>('/firebase/dm-pictures');
    }

    getImages(
        folder?: string,
        searchParam?: string,
    ): Observable<string[] | undefined> {
        if (!folder) {
            return of(undefined);
        }
        console.log(`ПАпка: ${this.baseUrl}/firebase/images/${folder}`);
        return this.http
            .get<string[]>(`${this.baseUrl}/firebase/images/${folder}`)
            .pipe(
                map((urls: string[]) => {
                    if (searchParam) {
                        return urls.filter((url) => url.includes(searchParam));
                    }
                    return urls;
                }),
            );
    }
}
