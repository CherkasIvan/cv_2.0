import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    private translations: any = {};

    public setTranslations(language: string, translations: any): void {
        this.translations[language] = translations;
    }

    public getTranslation(key: string, language: string): string {
        return this.translations[language][key] || key;
    }
}
