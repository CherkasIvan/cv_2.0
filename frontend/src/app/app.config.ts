import {
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withFetch,
    withInterceptorsFromDi,
} from '@angular/common/http';
import {
    ApplicationConfig,
    enableProdMode,
    importProvidersFrom,
    isDevMode,
    provideZoneChangeDetection,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
    BrowserModule,
    provideClientHydration,
    withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
    PreloadAllModules,
    RouterModule,
    provideRouter,
    withViewTransitions,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';

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

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '../environments/environment.development';
import { LoadingInterceptor } from './core/interceptors/loading/loading.interceptor';
import { AuthEffects } from './layout/store/auth-store/auth.effects';
import { authReducer } from './layout/store/auth-store/auth.reducers';
import { MAIN_ROUTES } from './main.routes';
import { SsrInterceptor } from '@core/interceptors/ssr/ssr.interceptor';
import { ApiPrefixInterceptor } from '@core/interceptors/api-prefix/api-prefix.interceptor';
import { AuthInterceptor } from '@core/interceptors/auth/auth.interceptor';

if (environment.production) {
    enableProdMode();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        {
            provide: FIREBASE_OPTIONS,
            useValue: environment.firebase,
        },
        provideAnimationsAsync(),
        provideHttpClient(withInterceptorsFromDi(), withFetch(), ),
        provideRouter(MAIN_ROUTES, withViewTransitions()),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
        provideStorage(() => getStorage()),
        provideAuth(() => getAuth()),

        provideTranslateService({
            loader: provideTranslateHttpLoader({
                prefix: '/assets/i18n/',
                suffix: '.json',
            }),
            fallbackLang: 'en',
        }),                
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiPrefixInterceptor,
            multi: true,
        },
                
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SsrInterceptor,
            multi: true,
        },
        provideClientHydration(
            withHttpTransferCacheOptions({
                includePostRequests: true,
            }),
        ),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),

        importProvidersFrom([
            BrowserModule,
            RouterModule.forRoot(MAIN_ROUTES, {
                preloadingStrategy: PreloadAllModules,
                enableViewTransitions: true,
            }),
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
        ]),
    ],
};
