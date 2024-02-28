import { Observable } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import {
    AngularFireDatabase,
    AngularFireList,
} from '@angular/fire/compat/database';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

import { IFileUpload } from '@core/models/file-upload.interface';
import { INavigation } from '@core/models/navigation.interface';

import { ISocialMedia } from '@app/core/models/social-media.interface';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    private basePath = 'gs://cv-cherkas-db.appspot.com';
    file!: File;
    url = '';

    navigationCollection$!: Observable<INavigation[]>;
    socialMediaLinksCollection$!: Observable<ISocialMedia[]>;
    charts$: AngularFireList<IFileUpload> | undefined;

    constructor(
        private db: AngularFireDatabase,
        private readonly _firestore: Firestore,
    ) {}

    getFiles(numberItems: number): AngularFireList<IFileUpload> {
        return (this.charts$ = this.db.list(this.basePath, (ref) =>
            ref.limitToLast(numberItems),
        ));
    }

    getNavigation(): Observable<INavigation[]> {
        this.navigationCollection$ = collectionData(
            collection(this._firestore, 'navigation'),
            {
                idField: 'id',
            },
        ) as Observable<INavigation[]>;
        return this.navigationCollection$;
    }

    getSocialMediaLinks(): Observable<ISocialMedia[]> {
        this.socialMediaLinksCollection$ = collectionData(
            collection(this._firestore, 'socialMediaLinks'),
            {
                idField: 'id',
            },
        ) as Observable<ISocialMedia[]>;
        return this.socialMediaLinksCollection$;
    }
}
