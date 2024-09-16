import Dexie from 'dexie';
import { Observable, from } from 'rxjs';

import { Injectable } from '@angular/core';

import { IIndexedDB } from '@app/core/models/indexed-db.interface';
import { TProfile } from '@app/layout/store/model/profile.type';

@Injectable({
    providedIn: 'root',
})
export class IndexedDbService extends Dexie {
    private db: Dexie.Table<IIndexedDB, number>;

    constructor() {
        super('UserState');
        this.version(1).stores({
            indexedDB: '++id,isFirstTime,isGuest,user,rout,settings',
        });
        this.db = this.table('indexedDB');
    }

    setItem(key: keyof IIndexedDB, value: any): Observable<void> {
        return from(
            this.db
                .toCollection()
                .first()
                .then((item) => {
                    if (item) {
                        return this.db
                            .update(item.id!, { [key]: value })
                            .then(() => {});
                    } else {
                        const newItem: IIndexedDB = {
                            isFirstTime: true,
                            isGuest: false,
                            user: null,
                            rout: {
                                experienceRoute: '',
                                technologiesRoute: '',
                                subTechRoute: '',
                                currentRoute: '',
                            },
                            settings: {
                                isDarkMode: false,
                                language: 'en',
                            },
                        };
                        (newItem as any)[key] = value; // Используем приведение типа
                        return this.db.add(newItem).then(() => {});
                    }
                }),
        );
    }

    getItem(key: keyof IIndexedDB): Observable<any> {
        return from(
            this.db
                .toCollection()
                .first()
                .then((item) => (item ? item[key] : null)),
        );
    }

    removeItem(key: keyof IIndexedDB): Observable<void> {
        return from(
            this.db
                .toCollection()
                .first()
                .then((item) => {
                    if (item) {
                        return this.db
                            .update(item.id!, { [key]: null })
                            .then(() => {});
                    } else {
                        return Promise.resolve(); // Возвращаем пустое обещание, если item не найден
                    }
                }),
        );
    }

    clear(): Observable<void> {
        return from(this.db.clear());
    }

    isFirstTime(): Observable<boolean> {
        return from(
            this.getItem('isFirstTime')
                .toPromise()
                .then((item) => (item !== null ? item : true)),
        );
    }

    setFirstTime(value: boolean): Observable<void> {
        return this.setItem('isFirstTime', value);
    }

    isGuest(): Observable<boolean> {
        return from(
            this.getItem('isGuest')
                .toPromise()
                .then((item) => (item !== null ? item : true)),
        );
    }

    setGuest(value: boolean): Observable<void> {
        return this.setItem('isGuest', value);
    }

    getUser(): Observable<TProfile | null> {
        return this.getItem('user');
    }

    setUser(user: TProfile): Observable<void> {
        return this.setItem('user', user);
    }

    getRoute(): Observable<any> {
        return this.getItem('rout');
    }

    setRoute(route: any): Observable<void> {
        return this.setItem('rout', route);
    }

    getSettings(): Observable<any> {
        return this.getItem('settings');
    }

    setSettings(settings: any): Observable<void> {
        return this.setItem('settings', settings);
    }
}
