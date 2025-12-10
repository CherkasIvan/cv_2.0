import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Language, TranslateLoader } from '@ngx-translate/core';

export class BackendTranslateLoader implements TranslateLoader {
    public constructor(private http: HttpClient) {}

    public getTranslation(lang: Language): Observable<string> {
        return this.http.get(`/i18n/${lang}/frontend`).pipe(
            map((response: any) => {
                console.log(
                    `✅ Translations loaded for ${lang}:`,
                    response.translations
                        ? Object.keys(response.translations).length
                        : 0,
                    'modules',
                );
                return response.translations || {};
            }),
            catchError((error) => {
                console.error(
                    `Failed to load translations for ${lang}:`,
                    error,
                );

                // Fallback к статическим файлам
                return this.http.get(`./assets/i18n/${lang}.json`).pipe(
                    catchError(() => {
                        console.warn(
                            `No translations found for ${lang}, using empty object`,
                        );
                        return of({});
                    }),
                );
            }),
        );
    }
}

export function createBackendTranslateLoader(
    http: HttpClient,
): BackendTranslateLoader {
    return new BackendTranslateLoader(http);
}
