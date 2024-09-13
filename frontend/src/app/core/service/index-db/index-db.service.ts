import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class IndexDbService {
    private _openRequest = indexedDB.open('userState', 2.0);

    constructor() {}
}
