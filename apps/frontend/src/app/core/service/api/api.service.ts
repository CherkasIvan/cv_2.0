import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { Injectable, computed, inject, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { TBackendTechnologies } from '@core/models/backend-technologies.type';
import { TEducationExperience } from '@core/models/education-experience.type';
import { TExperienceAside } from '@core/models/experience-aside.type';
import { TFrontendTechnologies } from '@core/models/frontend-technologies.type';
import { THardSkillsNav } from '@core/models/hard-skills-nav.type';
import { TMainPageInfo } from '@core/models/main-page-info';
import { TNavigation } from '@core/models/navigation.type';
import { TOtherTechnologies } from '@core/models/other-technologies.type';
import { TSocialMedia } from '@core/models/social-media.type';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { TWorkExperience } from '@core/models/work-experience.type';

interface ApiState {
    backendTech: TBackendTechnologies[];
    frontendTech: TFrontendTechnologies[];
    otherTech: TOtherTechnologies[];
    navigation: TNavigation[];
    socialMedia: TSocialMedia[];
    hardSkillsNav: THardSkillsNav[];
    workExperience: TWorkExperience[];
    mainPageInfo: TMainPageInfo | null;
    educationPlaces: TEducationExperience[];
    technologiesAside: TTechnologiesAside[];
    experienceAside: TExperienceAside[];
    themelessPictures: any[];
}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private http = inject(HttpClient);
    private isServer: boolean;

    // 🎯 State signal (только в памяти)
    private state = signal<ApiState>({
        backendTech: [],
        frontendTech: [],
        otherTech: [],
        navigation: [],
        socialMedia: [],
        hardSkillsNav: [],
        workExperience: [],
        mainPageInfo: null,
        educationPlaces: [],
        technologiesAside: [],
        experienceAside: [],
        themelessPictures: [],
    });

    // 🎯 Computed signals for each data type
    readonly backendTech = computed(() => this.state().backendTech);
    readonly frontendTech = computed(() => this.state().frontendTech);
    readonly otherTech = computed(() => this.state().otherTech);
    readonly navigation = computed(() => this.state().navigation);
    readonly socialMedia = computed(() => this.state().socialMedia);
    readonly hardSkillsNav = computed(() => this.state().hardSkillsNav);
    readonly workExperience = computed(() => this.state().workExperience);
    readonly mainPageInfo = computed(() => this.state().mainPageInfo);
    readonly educationPlaces = computed(() => this.state().educationPlaces);
    readonly technologiesAside = computed(() => this.state().technologiesAside);
    readonly experienceAside = computed(() => this.state().experienceAside);
    readonly themelessPictures = computed(() => this.state().themelessPictures);

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isServer = isPlatformServer(this.platformId);
    }

    // 🎯 Private state updater
    private updateState(updates: Partial<ApiState>) {
        this.state.update((current) => ({ ...current, ...updates }));
    }

    // 🎯 Create proper fallback data that matches the types
    private getNavigationFallback(): TNavigation[] {
        return this.isServer ? [
            {
                id: 'main-fallback',
                link: '/main',
                position: 1,
                value: 'Main',
                imgName: 'home'
            },
            {
                id: 'about-fallback',
                link: '/about',
                position: 2,
                value: 'About',
                imgName: 'info'
            }
        ] : [];
    }

    private getMainPageInfoFallback(): TMainPageInfo | null {
        return this.isServer ? {
            id: 'main-page-fallback',
            buttonHoverText: 'View portfolio',
            buttonText: 'Explore',
            description: 'Developer Portfolio',
            name: 'Portfolio',
            imgSrc: '',
            stack: 'Full Stack Developer',
            status: 'Available for work',
            imgName: 'avatar'
        } : null;
    }

    // 🎯 Data loading methods with SSR fallbacks
    getBackendTech() {
        return this.http
            .get<TBackendTechnologies[]>('/firebase/backend')
            .pipe(
                catchError((error) => {
                    console.error('Error loading backend tech:', error);
                    return of(this.isServer ? [] : []);
                }),
            );
    }

    getFrontendTech() {
        return this.http
            .get<TFrontendTechnologies[]>('/firebase/frontend')
            .pipe(
                catchError((error) => {
                    console.error('Error loading frontend tech:', error);
                    return of(this.isServer ? [] : []);
                }),
            );
    }

    getOtherTech() {
        return this.http
            .get<TOtherTechnologies[]>('/firebase/other')
            .pipe(
                catchError((error) => {
                    console.error('Error loading other tech:', error);
                    return of(this.isServer ? [] : []);
                }),
            );
    }

getNavigation() {
    if (this.isServer) {
        console.log('SSR: Returning fallback navigation');
        return of(this.getNavigationFallback());
    }
    
    return this.http
        .get<TNavigation[]>('/template/navigation')
        .pipe(
            catchError((error) => {
                console.error('Error loading navigation:', error);
                return of(this.getNavigationFallback());
            }),
        );
}

    getSocialMediaLinks() {
        return this.http
            .get<TSocialMedia[]>('/template/social-media')
            .pipe(
                catchError((error) => {
                    console.error('Error loading social media:', error);
                    return of(this.isServer ? [] : []);
                }),
            );
    }

    getHardSkillsNav() {
        return this.http
            .get<THardSkillsNav[]>('/template/hard-skills-nav')
            .pipe(
                catchError((error) => {
                    console.error('Error loading hard skills nav:', error);
                    return of(this.isServer ? [] : []);
                }),
            );
    }

    getWorkExperience() {
        return this.http
            .get<TWorkExperience[]>('/firebase/work-experience')
            .pipe(
                catchError((error) => {
                    console.error('Error loading work experience:', error);
                    return of(this.isServer ? [] : []);
                }),
            );
    }

    getMainPageInfo() {
        return this.http
            .get<TMainPageInfo[]>('/template/main-page-info')
            .pipe(
                map((data) => data[0]),
                catchError((error) => {
                    console.error('Error loading main page info:', error);
                    return of(this.getMainPageInfoFallback());
                }),
            );
    }

    getEducationPlaces() {
        return this.http
            .get<TEducationExperience[]>('/firebase/education-places')
            .pipe(
                catchError((error) => {
                    console.error('Error loading education places:', error);
                    return of(this.isServer ? [] : []);
                }),
            );
    }

    getTechnologiesAside() {
        return this.http
            .get<TTechnologiesAside[]>('/template/technologies-aside')
            .pipe(
                catchError((error) => {
                    console.error('Error loading technologies aside:', error);
                    return of(this.isServer ? [] : []);
                }),
            );
    }

    getExperienceAside() {
        return this.http
            .get<TExperienceAside[]>('/template/experience-aside')
            .pipe(
                catchError((error) => {
                    console.error('Error loading experience aside:', error);
                    return of(this.isServer ? [] : []);
                }),
            );
    }

    getThemelessPicturesImages() {
        return this.http
            .get<any[]>('/firebase/themeless-pictures')
            .pipe(
                catchError((error) => {
                    console.error('Error loading themeless pictures:', error);
                    return of(this.isServer ? [] : []);
                }),
            );
    }

// api.service.ts (partial fix for getImages method)
getImages(folder?: string, searchParam?: string) {
  if (!folder || this.isServer) {
    console.log('SSR: Skipping image loading for', folder);
    return of([]);
  }

  // Use a different approach to avoid circular dependencies
  return new Observable<string[]>(observer => {
    // Create a new HttpClient instance without interceptors for image loading
    const http = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
    
    http.get<string[]>(`/firebase/images/${folder}`)
      .pipe(
        map((urls) => {
          if (!urls || !Array.isArray(urls) || urls.length === 0) {
            console.warn(`⚠️ No images found in folder: ${folder}`);
            return [];
          }

          const validUrls = urls.filter(
            (url) => url && typeof url === 'string' && url.trim().length > 0,
          );

          let resultUrls = validUrls;

          if (searchParam) {
            resultUrls = validUrls.filter((url) =>
              url.toLowerCase().includes(searchParam.toLowerCase()),
            );
          }

          return resultUrls;
        }),
        catchError((error) => {
          console.error(`Error loading images from ${folder}:`, error.message);
          return of([]);
        })
      )
      .subscribe({
        next: (urls) => observer.next(urls),
        error: (err) => observer.error(err),
        complete: () => observer.complete()
      });
  });
}
    // В ApiService добавьте этот метод:

loadPublicData() {
    console.log('Loading public data from API...');
    
    // На сервере загружаем только минимальные данные с обработкой ошибок
    if (this.isServer) {
        console.log('SSR: Loading minimal public data');
        
        this.getNavigation().subscribe((data) => {
            this.updateState({ navigation: data });
            console.log('SSR: Navigation loaded:', data.length);
        });

        this.getMainPageInfo().subscribe((data) => {
            this.updateState({ mainPageInfo: data });
            console.log('SSR: Main page info loaded');
        });

        this.getSocialMediaLinks().subscribe((data) => {
            this.updateState({ socialMedia: data });
            console.log('SSR: Social media loaded:', data.length);
        });
    } else {
        // В браузере загружаем все данные
        console.log('Browser: Loading full public data');
        
        this.getNavigation().subscribe((data) => {
            this.updateState({ navigation: data });
        });

        this.getMainPageInfo().subscribe((data) => {
            this.updateState({ mainPageInfo: data });
        });

        this.getSocialMediaLinks().subscribe((data) => {
            this.updateState({ socialMedia: data });
        });

        this.getBackendTech().subscribe((data) => {
            this.updateState({ backendTech: data });
        });

        this.getFrontendTech().subscribe((data) => {
            this.updateState({ frontendTech: data });
        });

        this.getWorkExperience().subscribe((data) => {
            this.updateState({ workExperience: data });
        });
    }
}

    // 🎯 Load all data and update state
    loadAllData() {
        this.getBackendTech().subscribe((data) => {
            this.updateState({ backendTech: data });
        });

        this.getFrontendTech().subscribe((data) => {
            this.updateState({ frontendTech: data });
        });

        this.getOtherTech().subscribe((data) => {
            this.updateState({ otherTech: data });
        });

        this.getNavigation().subscribe((data) => {
            this.updateState({ navigation: data });
        });

        this.getWorkExperience().subscribe((data) => {
            this.updateState({ workExperience: data });
        });

        this.getMainPageInfo().subscribe((data) => {
            this.updateState({ mainPageInfo: data });
        });
    }
}
