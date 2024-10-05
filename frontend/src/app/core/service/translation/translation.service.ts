import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    private translations: any = {};

    constructor(private http: HttpClient) {}

    public loadTranslations(language: string): Observable<any> {
        console.log(language);
        return this.http.get(`/assets/i18n/${language}.json`);
    }

    public setTranslations(language: string, translations: any): void {
        this.translations[language] = translations;
    }

    public getTranslation(key: string, language: string): string {
        return this.translations[language][key] || key;
    }
}
