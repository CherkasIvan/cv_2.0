import { Observable } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    private translations: any = {};
    private _isBrowser: boolean = isPlatformBrowser(this.platformId);

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {}

    // loadTranslations(language: string): Observable<any> {
    //     const baseUrl = this._isBrowser ? '' : 'http://localhost:4000'; // Замените на ваш базовый URL
    //     return this.http.get(`${baseUrl}/assets/i18n/${language}`);
    // }

    public setTranslations(language: string, translations: any): void {
        this.translations[language] = translations;
    }

    public getTranslation(key: string, language: string): string {
        return this.translations[language][key] || key;
    }
}
