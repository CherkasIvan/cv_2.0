import {
    HttpClient,
    provideHttpClient,
    withFetch,
    withInterceptors,
    withXsrfConfiguration,
} from '@angular/common/http';
import {
    ApplicationConfig,
    enableProdMode,
    importProvidersFrom,
    isDevMode,
    provideZoneChangeDetection,
} from '@angular/core';
import {
    provideClientHydration,
    withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { ApiPrefixInterceptor } from '@core/interceptors/api-prefix/api-prefix.interceptor';
import { AuthInterceptor } from '@core/interceptors/auth/auth.interceptor';
import { LoadingInterceptor } from '@core/interceptors/loading/loading.interceptor';
import { SsrInterceptor } from '@core/interceptors/ssr/ssr.interceptor';
import { darkModeReducer } from '@layout/store/dark-mode-store/dark-mode.reducers';
import { experienceDialogReducer } from '@layout/store/experience-dialog-store/experience-dialog.reducers';
import { FirebaseEffects } from '@layout/store/firebase-store/firebase.effects';
import { firebaseReducer } from '@layout/store/firebase-store/firebase.reducers';
import { GithubRepositoriesEffects } from '@layout/store/github-projects-store/github-projects.effects';
import { githubRepositoriesReducer } from '@layout/store/github-projects-store/github-projects.reducer';
import { ImagesEffects } from '@layout/store/images-store/images.effects';
import { imagesReducer } from '@layout/store/images-store/images.reducers';
import { languageReducer } from '@layout/store/language-selector-store/language.reducers';
import { spinnerReducer } from '@layout/store/spinner-store/spinner.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
// Импорты ngx-translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BackendTranslateLoader } from '@utils/class/backend-translate-loader.class';

import { environment } from '../environments/environment.development';
import { AuthEffects } from './layout/store/auth-store/auth.effects';
import { authReducer } from './layout/store/auth-store/auth.reducers';
import { MAIN_ROUTES } from './main.routes';

if (environment.production) {
    enableProdMode();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideAnimationsAsync(),
        provideHttpClient(
            withFetch(),
            withInterceptors([
                ApiPrefixInterceptor,
                AuthInterceptor,
                LoadingInterceptor,
            ]),
            withXsrfConfiguration({
                cookieName: 'XSRF-TOKEN',
                headerName: 'X-XSRF-TOKEN',
            }),
        ),

        provideClientHydration(
            withHttpTransferCacheOptions({
                includePostRequests: true,
                includeHeaders: ['Authorization', 'Content-Type'],
            }),
        ),

        provideRouter(MAIN_ROUTES, withViewTransitions()),
        importProvidersFrom(
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: (http: HttpClient) =>
                        new BackendTranslateLoader(http),
                    deps: [HttpClient],
                },
                defaultLanguage: 'en',
            }),
        ),

        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),

        // NgRx configuration
        importProvidersFrom(
            StoreModule.forRoot({
                router: routerReducer,
            }),
            EffectsModule.forRoot([
                FirebaseEffects,
                AuthEffects,
                GithubRepositoriesEffects,
                ImagesEffects,
            ]),
            StoreModule.forFeature('images', imagesReducer),
            StoreModule.forFeature('spinner', spinnerReducer),
            StoreModule.forFeature('firebase', firebaseReducer),
            StoreModule.forFeature('darkMode', darkModeReducer),
            StoreModule.forFeature('language', languageReducer),
            StoreModule.forFeature('github', githubRepositoriesReducer),
            StoreModule.forFeature('experience', experienceDialogReducer),
            StoreModule.forFeature('auth', authReducer),
            StoreRouterConnectingModule.forRoot(),
        ),
    ],
};
