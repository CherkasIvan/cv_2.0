import { Observable, map } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import {
    AngularFireDatabase,
    AngularFireList,
} from '@angular/fire/compat/database';
import {
    CollectionReference,
    Firestore,
    collection,
    collectionData,
    orderBy,
    query,
} from '@angular/fire/firestore';

import { IEducation } from '@core/models/education.interface';
import { TExperienceAside } from '@core/models/experience-aside.type';
import { IFileUpload } from '@core/models/file-upload.interface';
import { IMainPageInfo } from '@core/models/main-page-info';
import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
import { TTechnologiesAside } from '@core/models/technologies-aside.type';
import { ITechnologies } from '@core/models/technologies.interface';
import { IWorkExperience } from '@core/models/work-experience.interface';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    private basePath = 'gs://cv-cherkas-db.appspot.com';
    file!: File;
    url = '';
    private _firestore = inject(Firestore);

    frontendTechCollection$!: Observable<ITechnologies[]>;
    backendTechCollection$!: Observable<ITechnologies[]>;
    otherTechCollection$!: Observable<ITechnologies[]>;
    navigationCollection$!: Observable<INavigation[]>;
    workExperienceCollection$!: Observable<IWorkExperience[]>;
    educationCollection$!: Observable<IEducation[]>;
    socialMediaLinksCollection$!: Observable<ISocialMedia[]>;
    hardSkillsNavCollection$!: Observable<INavigation[]>;
    charts$: AngularFireList<IFileUpload> | undefined;
    mainPageInfo$!: Observable<IMainPageInfo>;

    experienceAside$!: Observable<TExperienceAside[]>;
    technologiesAside$!: Observable<TTechnologiesAside[]>;

    constructor(private db: AngularFireDatabase) {}

    getImages(): Observable<ImageData[]> {
        return this.db.list<ImageData>('путь/к/изображениям').valueChanges();
    }

    getFiles(numberItems: number): AngularFireList<IFileUpload> {
        return (this.charts$ = this.db.list(this.basePath, (ref) =>
            ref.limitToLast(numberItems),
        ));
    }

    getNavigation(): Observable<INavigation[]> {
        const navigationRef = collection(
            this._firestore,
            'navigation',
        ) as CollectionReference<INavigation>;
        const navigationQuery = query(navigationRef, orderBy('position'));
        this.navigationCollection$ = collectionData(navigationQuery, {
            idField: 'id',
        }) as Observable<INavigation[]>;
        return this.navigationCollection$;
    }

    getSocialMediaLinks(): Observable<ISocialMedia[]> {
        const socialMediaLinksRef = collection(
            this._firestore,
            'socialMediaLinks',
        ) as CollectionReference<ISocialMedia>;
        this.socialMediaLinksCollection$ = collectionData(socialMediaLinksRef, {
            idField: 'id',
        }) as Observable<ISocialMedia[]>;
        return this.socialMediaLinksCollection$;
    }

    getWorkExperience(): Observable<IWorkExperience[]> {
        const workExperienceRef = collection(
            this._firestore,
            'workExperience',
        ) as CollectionReference<IWorkExperience>;
        this.workExperienceCollection$ = collectionData(workExperienceRef, {
            idField: 'id',
        }) as Observable<IWorkExperience[]>;
        return this.workExperienceCollection$;
    }

    getBackendTech(): Observable<ITechnologies[]> {
        const backendTechRef = collection(
            this._firestore,
            'backendTech',
        ) as CollectionReference<ITechnologies>;
        this.backendTechCollection$ = collectionData(backendTechRef, {
            idField: 'id',
        }) as Observable<ITechnologies[]>;
        return this.backendTechCollection$;
    }

    getOtherTech(): Observable<ITechnologies[]> {
        const otherTechRef = collection(
            this._firestore,
            'otherTech',
        ) as CollectionReference<ITechnologies>;
        this.otherTechCollection$ = collectionData(otherTechRef, {
            idField: 'id',
        }) as Observable<ITechnologies[]>;
        return this.otherTechCollection$;
    }

    getFrontendTech(): Observable<ITechnologies[]> {
        const frontendTechRef = collection(
            this._firestore,
            'frontendTech',
        ) as CollectionReference<ITechnologies>;
        this.frontendTechCollection$ = collectionData(frontendTechRef, {
            idField: 'id',
        }) as Observable<ITechnologies[]>;
        return this.frontendTechCollection$;
    }

    getHardSkillsNav(): Observable<INavigation[]> {
        const hardSkillsNavRef = collection(
            this._firestore,
            'hardSkillsNav',
        ) as CollectionReference<INavigation>;
        this.hardSkillsNavCollection$ = collectionData(hardSkillsNavRef, {
            idField: 'id',
        }) as Observable<INavigation[]>;
        return this.hardSkillsNavCollection$;
    }

    getEducationPlaces(): Observable<IEducation[]> {
        const educationPlacesRef = collection(
            this._firestore,
            'educationExperience',
        ) as CollectionReference<IEducation>;
        this.educationCollection$ = collectionData(educationPlacesRef, {
            idField: 'id',
        }) as Observable<IEducation[]>;
        return this.educationCollection$;
    }

    getMainPageInfo(): Observable<IMainPageInfo> {
        const mainPageInfoRef = collection(
            this._firestore,
            'mainPageInfo',
        ) as CollectionReference<IMainPageInfo>;
        return collectionData(mainPageInfoRef, { idField: 'id' }).pipe(
            map((data) => data[0] as IMainPageInfo),
        );
    }

    getTechnologiesAside(): Observable<TTechnologiesAside[]> {
        const technologiesAsideRef = collection(
            this._firestore,
            'technologiesAside',
        ) as CollectionReference<TTechnologiesAside>;
        this.technologiesAside$ = collectionData(technologiesAsideRef, {
            idField: 'id',
        }) as Observable<TTechnologiesAside[]>;
        return this.technologiesAside$;
    }

    getExperienceAside(): Observable<TExperienceAside[]> {
        const experienceAsideRef = collection(
            this._firestore,
            'experienceAside',
        ) as CollectionReference<TExperienceAside>;
        this.experienceAside$ = collectionData(experienceAsideRef, {
            idField: 'id',
        }) as Observable<TExperienceAside[]>;
        return this.experienceAside$;
    }
}
