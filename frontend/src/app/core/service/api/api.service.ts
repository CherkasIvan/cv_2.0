import { Observable, map, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IEducationExperience } from '@core/models/education.interface';
import { TExperienceAside } from '@core/models/experience-aside.type';
import { IMainPageInfo } from '@core/models/main-page-info';
import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { ITechnologies } from '@core/models/technologies.interface';
import { IWorkExperience } from '@core/models/work-experience.interface';

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

    getWorkExperience(): Observable<IWorkExperience[]> {
        return this.http.get<IWorkExperience[]>(
            `${this.baseUrl}/firebase/work-experience`,
        );
    }

    getMainPageInfo(): Observable<IMainPageInfo> {
        return this.http
            .get<IMainPageInfo[]>(`${this.baseUrl}/firebase/main-page-info`)
            .pipe(map((data) => data[0]));
    }

    getEducationPlaces(): Observable<IEducationExperience[]> {
        return this.http.get<IEducationExperience[]>(
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

    getImages(folder?: string): Observable<string[] | undefined> {
        if (!folder) {
            return of(undefined);
        }
        return this.http.get<string[]>(
            `${this.baseUrl}/firebase/images/${folder}`,
        );
    }
}
