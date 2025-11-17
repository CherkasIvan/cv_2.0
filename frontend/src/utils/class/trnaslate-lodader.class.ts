// custom-translate-loader.ts
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

import { TranslateLoader } from '@ngx-translate/core';

export class HttpLoadFactory implements TranslateLoader {
    constructor(private http: HttpClient) {}

    getTranslation(lang: string): Observable<any> {
        return this.http.get(`/assets/i18n/${lang}.json`);
    }
}
