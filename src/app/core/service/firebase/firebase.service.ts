import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import {
    AngularFireDatabase,
    AngularFireList,
} from '@angular/fire/compat/database';
import {
    collection,
    collectionData,
    getFirestore,
} from '@angular/fire/firestore';

import { IFileUpload } from '@core/models/file-upload.interface';
import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
import { ITechnologies } from '@core/models/technologies.interface';
import { IWorkExperience } from '@core/models/work-experience.interface';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    private basePath = 'gs://cv-cherkas-db.appspot.com';
    file!: File;
    url = '';
    private _firestore = getFirestore();

    frontendTechCollection$!: Observable<ITechnologies[]>;
    backendTechCollection$!: Observable<ITechnologies[]>;
    otherTechCollection$!: Observable<ITechnologies[]>;

    navigationCollection$!: Observable<INavigation[]>;
    workExperienceCollection$!: Observable<IWorkExperience[]>;
    educationCollection$!: Observable<IWorkExperience[]>;
    socialMediaLinksCollection$!: Observable<ISocialMedia[]>;
    hardSkillsNavCollection$!: Observable<INavigation[]>;
    charts$: AngularFireList<IFileUpload> | undefined;

    constructor(private db: AngularFireDatabase) {}

    getFiles(numberItems: number): AngularFireList<IFileUpload> {
        return (this.charts$ = this.db.list(this.basePath, (ref) =>
            ref.limitToLast(numberItems),
        ));
    }

    getNavigation(): Observable<INavigation[]> {
        const navigationRef = collection(this._firestore, 'navigation');
        this.navigationCollection$ = collectionData(navigationRef, {
            idField: 'id',
        }) as Observable<INavigation[]>;
        return this.navigationCollection$;
    }

    getSocialMediaLinks(): Observable<ISocialMedia[]> {
        const socialMediaLinksRef = collection(
            this._firestore,
            'socialMediaLinks',
        );
        this.socialMediaLinksCollection$ = collectionData(socialMediaLinksRef, {
            idField: 'id',
        }) as Observable<ISocialMedia[]>;
        return this.socialMediaLinksCollection$;
    }

    getWorkExperience(): Observable<IWorkExperience[]> {
        const workExperienceRef = collection(this._firestore, 'workExperience');
        this.workExperienceCollection$ = collectionData(workExperienceRef, {
            idField: 'id',
        }) as Observable<IWorkExperience[]>;
        return this.workExperienceCollection$;
    }

    getBackendTech(): Observable<ITechnologies[]> {
        const backendTechRef = collection(this._firestore, 'backendTech');
        this.backendTechCollection$ = collectionData(backendTechRef, {
            idField: 'id',
        }) as Observable<ITechnologies[]>;
        return this.backendTechCollection$;
    }

    getOtherTech(): Observable<ITechnologies[]> {
        const otherTechRef = collection(this._firestore, 'otherTech');
        this.otherTechCollection$ = collectionData(otherTechRef, {
            idField: 'id',
        }) as Observable<ITechnologies[]>;
        return this.otherTechCollection$;
    }

    getFrontendTech(): Observable<ITechnologies[]> {
        const frontendTechRef = collection(this._firestore, 'frontendTech');
        this.frontendTechCollection$ = collectionData(frontendTechRef, {
            idField: 'id',
        }) as Observable<ITechnologies[]>;
        return this.frontendTechCollection$;
    }

    getHardSkillsNav(): Observable<INavigation[]> {
        const hardSkillsNavRef = collection(this._firestore, 'hardSkillsNav');
        this.hardSkillsNavCollection$ = collectionData(hardSkillsNavRef, {
            idField: 'id',
        }) as Observable<INavigation[]>;
        return this.hardSkillsNavCollection$;
    }

    getEducationPlaces(): Observable<IWorkExperience[]> {
        const educationExperienceRef = collection(
            this._firestore,
            'educationExperience',
        );
        this.educationCollection$ = collectionData(educationExperienceRef, {
            idField: 'id',
        }) as Observable<IWorkExperience[]>;
        return this.educationCollection$;
    }
}
