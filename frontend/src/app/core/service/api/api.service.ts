import { Observable, map, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TWorkExperience } from '@core/models/work-experience.type';
import { TNavigation } from '@core/models/navigation.type';
import { TSocialMedia } from '@core/models/social-media.type';
import { TFrontendTechnologies,  } from '@core/models/frontend-technologies.type';
import { TBackendTechnologies } from '@core/models/backend-technologies.type';
import { TOtherTechnologies } from '@core/models/other-technologies.type';
import { THardSkillsNav } from '@core/models/hard-skills-nav.type';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { TExperienceAside } from '@core/models/experience-aside.type';
import { TMainPageInfo } from '@core/models/main-page-info';
import { TEducationExperience } from '@core/models/education-experience.type';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) {}

    getBackendTech(): Observable<TBackendTechnologies[]> {
        return this.http.get<TBackendTechnologies[]>(
            `${this.baseUrl}/firebase/backend`,
        );
    }

    getFrontendTech(): Observable<TFrontendTechnologies[]> {
        return this.http.get<TFrontendTechnologies[]>(
            `${this.baseUrl}/firebase/frontend`,
        );
    }

    getOtherTech(): Observable<TOtherTechnologies[]> {
        return this.http.get<TOtherTechnologies[]>(`${this.baseUrl}/firebase/other`);
    }

    getNavigation(): Observable<TNavigation[]> {
        return this.http.get<TNavigation[]>(
            `${this.baseUrl}/firebase/navigation`,
        );
    }

    getSocialMediaLinks(): Observable<TSocialMedia[]> {
        return this.http.get<TSocialMedia[]>(
            `${this.baseUrl}/firebase/social-media-links`,
        );
    }

    getHardSkillsNav(): Observable<THardSkillsNav[]> {
        return this.http.get<THardSkillsNav[]>(
            `${this.baseUrl}/firebase/hard-skills-nav`,
        );
    }

    getWorkExperience(): Observable<TWorkExperience[]> {
        return this.http.get<TWorkExperience[]>(
            `${this.baseUrl}/firebase/work-experience`,
        );
    }

    getMainPageInfo(): Observable<TMainPageInfo> {
        return this.http
            .get<TMainPageInfo[]>(`${this.baseUrl}/firebase/main-page-info`)
            .pipe(map((data) => data[0]));
    }

    getEducationPlaces(): Observable<TEducationExperience[] | TWorkExperience[]> {
        return this.http.get<TEducationExperience[] | TWorkExperience[]>(
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

    getImages(
        folder?: string,
        searchParam?: string,
    ): Observable<string[] | undefined> {
        if (!folder) {
            return of(undefined);
        }
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
