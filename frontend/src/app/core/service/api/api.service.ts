import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ITechnologies } from '@app/core/models/technologies.interface';

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

    getImages(folder: string): Observable<any[]> {
        console.log('КАРТИНКИ');
        return this.http.get<any[]>(
            `${this.baseUrl}/firebase/images/${folder}`,
        );
    }
}
