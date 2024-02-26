import { Firestore, collection } from 'firebase/firestore';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import {
    AngularFireDatabase,
    AngularFireList,
} from '@angular/fire/compat/database';
import { collectionData } from '@angular/fire/firestore';

// import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { IFileUpload } from '@core/models/file-upload.interface';
import { INavigation } from '@core/models/navigation.interface';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    private basePath = 'gs://cv-cherkas-db.appspot.com';
    file!: File;
    url = '';

    navigationCollection$!: Observable<INavigation[]>;
    charts$: AngularFireList<IFileUpload> | undefined;

    constructor(
        private readonly _firestore: Firestore,
        private db: AngularFireDatabase,
    ) {}

    getFiles(numberItems: number): AngularFireList<IFileUpload> {
        return (this.charts$ = this.db.list(this.basePath, (ref) =>
            ref.limitToLast(numberItems),
        ));
    }

    getNavigation(): Observable<INavigation[]> {
        this.navigationCollection$ = collectionData(
            collection(this._firestore, 'header'),
            {
                idField: 'id',
            },
        ) as Observable<INavigation[]>;
        return this.navigationCollection$;
    }
}
