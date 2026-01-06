// translation.service.ts
import {
    Observable,
    catchError,
    forkJoin,
    map,
    of,
    switchMap,
    tap,
} from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
    Injectable,
    PLATFORM_ID,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';

import { environment } from '@env/environment';

export type Language = 'en' | 'ru';

export interface Translation {
    [key: string]: string | Translation;
}

export interface XliffFile {
    xliff: {
        file: {
            body: {
                'trans-unit': Array<{
                    _id: string;
                    source: string;
                    target?: string;
                }>;
            };
        };
    };
}

@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);
    private readonly apiUrl = `${environment.apiUrl}/i18n`;

    // 🎯 State signals
    private currentLanguage = signal<Language>('en');
    private translations = signal<Map<Language, Translation>>(new Map());
    private isLoading = signal(false);
    private modules = signal<string[]>([]);

    readonly language = computed(() => this.currentLanguage());
    readonly isLoading$ = computed(() => this.isLoading());
    readonly availableModules = computed(() => this.modules());

    readonly currentTranslations = computed(
        () => this.translations().get(this.currentLanguage()) || {},
    );

    private translationEffect = effect(
        () => {
            const lang = this.currentLanguage();
            if (!this.translations().has(lang)) {
                this.loadAllTranslations(lang).subscribe();
            }
        },
        { allowSignalWrites: true },
    );

    setLanguage(lang: Language): void {
        this.currentLanguage.set(lang);
    }

    /**
     * Получить перевод по ключу
     */
    getTranslation(key: string, params?: Record<string, any>): string {
        const translation = this.getNestedTranslation(
            key,
            this.currentTranslations(),
        );

        if (!translation || typeof translation !== 'string') {
            console.warn(`Translation not found for key: ${key}`);
            return key;
        }

        return params ? this.interpolate(translation, params) : translation;
    }

    /**
     * Получить все переводы для языка (Observable)
     * ФИКС: Изменен возвращаемый тип с Record<Language, any> на Translation
     */
    getTranslations$(lang: Language): Observable<Translation> {
        return this.loadAllTranslations(lang);
    }

    /**
     * Получить переводы для конкретного модуля (XLIFF формат)
     * ФИКС: Явное приведение типа lang к Language если необходимо
     */
    getModuleTranslations$(
        lang: string,
        module: string,
    ): Observable<Translation> {
        const url = this.buildUrl(`/${lang}/${module}`);

        return this.http
            .get<XliffFile>(url, {
                responseType: 'json',
                headers: {
                    Accept: 'application/xml, application/json',
                },
            })
            .pipe(
                map((xliff) => this.parseXliffToJson(xliff)),
                catchError((error) => {
                    console.error(
                        `Failed to load ${module} translations:`,
                        error,
                    );
                    return of({});
                }),
            );
    }

    /**
     * Получить все модули переводов для языка
     */
    getAllModuleTranslations$(
        lang: Language,
    ): Observable<{ name: string; content: Translation }[]> {
        return this.getAvailableModules$(lang).pipe(
            switchMap((modules) => {
                const requests = modules.map((module) =>
                    this.getModuleTranslations$(lang, module).pipe(
                        map((content) => ({ name: module, content })),
                    ),
                );
                return forkJoin(requests);
            }),
            catchError((error) => {
                console.error('Failed to load translation modules:', error);
                return of([]);
            }),
        );
    }

    /**
     * Получить конкретный ключ перевода
     */
    getTranslationKey$(
        lang: string,
        key: string,
    ): Observable<{ value: string; module: string } | null> {
        const url = this.buildUrl(`/${lang}/keys/${key}`);
        return this.http.get<{ value: string; module: string }>(url).pipe(
            catchError((error) => {
                console.error(
                    `Failed to load translation for key ${key}:`,
                    error,
                );
                return of(null);
            }),
        );
    }

    /**
     * Получить список доступных языков
     */
    getAvailableLanguages$(): Observable<string[]> {
        const url = this.buildUrl('/languages');
        return this.http.get<string[]>(url).pipe(
            catchError((error) => {
                console.error('Failed to load available languages:', error);
                return of(['en', 'ru']);
            }),
        );
    }

    /**
     * Получить список модулей для языка
     * ФИКС: Явное приведение типа lang к Language
     */
    getAvailableModules$(lang: Language): Observable<string[]> {
        const url = this.buildUrl(`/${lang}/modules`);
        return this.http.get<string[]>(url).pipe(
            tap((modules) => this.modules.set(modules)),
            catchError((error) => {
                console.error('Failed to load translation modules:', error);
                return of(['app', 'auth', 'cv', 'modals', 'shared']);
            }),
        );
    }

    /**
     * Обновить/перезагрузить переводы
     */
    refreshTranslations(): Observable<void> {
        const lang = this.currentLanguage();
        const currentMap = new Map(this.translations());
        currentMap.delete(lang);
        this.translations.set(currentMap);

        return this.loadAllTranslations(lang).pipe(map(() => void 0));
    }

    /**
     * ФИКС: Изменен возвращаемый тип с Observable<Language> на Observable<Translation>
     */
    private loadAllTranslations(lang: Language): Observable<Translation> {
        this.isLoading.set(true);

        return this.getAllModuleTranslations$(lang).pipe(
            map((modules) => {
                // Объединяем все модули в один объект переводов
                const allTranslations: Translation = {};

                modules.forEach((module) => {
                    Object.assign(allTranslations, module.content);
                });

                return allTranslations;
            }),
            tap((translations) => {
                const currentMap = new Map(this.translations());
                currentMap.set(lang, translations);
                this.translations.set(currentMap);
                this.isLoading.set(false);
                console.log(
                    `✅ Translations loaded for ${lang}:`,
                    Object.keys(translations).length,
                    'keys',
                );
            }),
            catchError((error) => {
                console.error(
                    `Failed to load translations for ${lang}:`,
                    error,
                );
                this.isLoading.set(false);

                // Fallback к английскому
                if (lang !== 'en') {
                    console.log('Falling back to English translations');
                    return this.loadAllTranslations('en');
                }

                return of({});
            }),
        );
    }

    /**
     * Парсит XLIFF в JSON формат
     */
    private parseXliffToJson(xliff: XliffFile): Translation {
        const translations: Translation = {};

        if (!xliff?.xliff?.file?.body?.['trans-unit']) {
            return translations;
        }

        const transUnits = Array.isArray(xliff.xliff.file.body['trans-unit'])
            ? xliff.xliff.file.body['trans-unit']
            : [xliff.xliff.file.body['trans-unit']];

        transUnits.forEach((unit) => {
            const key = unit._id;
            const value = unit.target || unit.source;

            this.setNestedValue(translations, key, value);
        });

        return translations;
    }

    /**
     * Устанавливает значение по вложенному ключу
     */
    private setNestedValue(obj: Translation, key: string, value: string): void {
        const parts = key.split('.');
        let current: any = obj;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            if (i === parts.length - 1) {
                current[part] = value;
            } else {
                if (!current[part] || typeof current[part] !== 'object') {
                    current[part] = {};
                }
                current = current[part];
            }
        }
    }

    /**
     * Вспомогательный метод для построения корректного URL
     */
    private buildUrl(path: string): string {
        if (
            isPlatformBrowser(this.platformId) ||
            path.startsWith('http://') ||
            path.startsWith('https://')
        ) {
            return `${this.apiUrl}${path}`;
        }

        return `${this.apiUrl}${path}`;
    }

    private getNestedTranslation(
        key: string,
        obj?: Translation,
    ): string | Translation | undefined {
        if (!obj) return undefined;

        const parts = key.split('.');
        let current: any = obj;

        for (const part of parts) {
            if (current[part] === undefined) {
                return undefined;
            }
            current = current[part];
        }

        return current;
    }

    private interpolate(text: string, params: Record<string, any>): string {
        return Object.keys(params).reduce((result, key) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            return result.replace(regex, params[key]);
        }, text);
    }

    /**
     * 🎯 SSR compatibility
     * ФИКС: Изменен возвращаемый тип и логика
     */
    preloadTranslations(languages: Language[]): Observable<Translation[]> {
        this.isLoading.set(true);

        const requests = languages.map((lang) =>
            this.loadAllTranslations(lang),
        );

        return forkJoin(requests).pipe(tap(() => this.isLoading.set(false)));
    }
}
