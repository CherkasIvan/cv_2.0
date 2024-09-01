import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IEducationExperience } from '@app/core/models/education.interface';
import { TExperienceAside } from '@app/core/models/experience-aside.type';
import { IMainPageInfo } from '@app/core/models/main-page-info';
import { INavigation } from '@app/core/models/navigation.interface';
import { ISocialMedia } from '@app/core/models/social-media.interface';
import { TTechnologiesAside } from '@app/core/models/technologies-aside.type';
import { ITechnologies } from '@app/core/models/technologies.interface';
import { IWorkExperience } from '@app/core/models/work-experience.interface';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) {}

    getBackendTech(): Observable<ITechnologies[]> {
        console.log('СРАБОТАЛО');
        return this.http.get<ITechnologies[]>(
            `${this.baseUrl}/firebase/backend-tech`,
        );
    }

    getFrontendTech(): Observable<ITechnologies[]> {
        console.log('СРАБОТАЛО');
        return this.http.get<ITechnologies[]>(
            `${this.baseUrl}/firebase/frontend-tech`,
        );
    }

    getOtherTech(): Observable<ITechnologies[]> {
        console.log('СРАБОТАЛО');
        return this.http.get<ITechnologies[]>(
            `${this.baseUrl}/firebase/other-tech`,
        );
    }

    getNavigation(): Observable<INavigation[]> {
        console.log('СРАБОТАЛО');
        return this.http.get<INavigation[]>(
            `${this.baseUrl}/firebase/navigation`,
        );
    }

    getSocialMediaLinks(): Observable<ISocialMedia[]> {
        console.log('СРАБОТАЛО');
        return this.http.get<ISocialMedia[]>(
            `${this.baseUrl}/firebase/social-media-links`,
        );
    }

    getHardSkillsNav(): Observable<INavigation[]> {
        console.log('СРАБОТАЛО');
        return this.http.get<INavigation[]>(
            `${this.baseUrl}/firebase/hard-skills-nav`,
        );
    }

    getWorkExperience(): Observable<IWorkExperience[]> {
        console.log('СРАБОТАЛО');
        return this.http.get<IWorkExperience[]>(
            `${this.baseUrl}/firebase/work-experience`,
        );
    }

    getMainPageInfo(): Observable<IMainPageInfo> {
        console.log('СРАБОТАЛО');
        return this.http
            .get<IMainPageInfo[]>(`${this.baseUrl}/firebase/main-page-info`)
            .pipe(map((data) => data[0]));
    }

    getEducationPlaces(): Observable<IEducationExperience[]> {
        console.log('СРАБОТАЛО');
        return this.http.get<IEducationExperience[]>(
            `${this.baseUrl}/firebase/education-places`,
        );
    }

    getTechnologiesAside(): Observable<TTechnologiesAside[]> {
        console.log('СРАБОТАЛО');
        return this.http.get<TTechnologiesAside[]>(
            `${this.baseUrl}/firebase/technologies-aside`,
        );
    }
    getExperienceAside(): Observable<TExperienceAside[]> {
        console.log('СРАБОТАЛО');
        return this.http.get<TExperienceAside[]>(
            `${this.baseUrl}/firebase/experience-aside`,
        );
    }

    getImages(folder: string): Observable<any[]> {
        console.log('КАРТИНКИ');
        return this.http.get<any[]>(
            `${this.baseUrl}/firebase/images/${folder}`,
        );
    }
}
