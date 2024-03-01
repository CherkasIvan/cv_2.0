import { Observable } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import {
    AngularFireDatabase,
    AngularFireList,
} from '@angular/fire/compat/database';
import {
    collection,
    collectionData,
    getFirestore,
} from '@angular/fire/firestore';

import { IEducation } from '@core/models/education.interface';
import { IFileUpload } from '@core/models/file-upload.interface';
import { INavigation } from '@core/models/navigation.interface';
import { ISocialMedia } from '@core/models/social-media.interface';
import { IWorkExperience } from '@core/models/work-experience.interface';

import { ITechnologies } from '@app/core/models/technologies.interface';

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
    socialTechCollection$!: Observable<ITechnologies[]>;
    navigationCollection$!: Observable<INavigation[]>;
    workExperienceCollection$!: Observable<IWorkExperience[]>;
    educationCollection$!: Observable<IEducation[]>;
    socialMediaLinksCollection$!: Observable<ISocialMedia[]>;
    charts$: AngularFireList<IFileUpload> | undefined;

    constructor(
        private db: AngularFireDatabase,
        // private readonly _firestore: Firestore,
    ) {}

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
}
