import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class BackendTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    console.log(`🌐 Loading translations for language: ${lang}`);
    
    return this.http.get(`/i18n/${lang}/frontend`).pipe(
      map((response: any) => {
        console.log(`✅ Translations loaded for ${lang}:`, 
          response.translations ? Object.keys(response.translations).length : 0, 'modules');
        return response.translations || {};
      }),
      catchError(error => {
        console.error(`Failed to load translations for ${lang}:`, error);
        
        // Fallback к статическим файлам
        return this.http.get(`./assets/i18n/${lang}.json`).pipe(
          catchError(() => {
            console.warn(`No translations found for ${lang}, using empty object`);
            return of({});
          })
        );
      })
    );
  }
}

export function createBackendTranslateLoader(http: HttpClient): BackendTranslateLoader {
  return new BackendTranslateLoader(http);
}