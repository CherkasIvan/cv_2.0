import {
    HTTP_INTERCEPTORS,
    HttpClient,
    provideHttpClient,
    withFetch,
    withInterceptorsFromDi,
} from '@angular/common/http';
import {
    ApplicationConfig,
    enableProdMode,
    importProvidersFrom,
    isDevMode,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
    BrowserModule,
    provideClientHydration,
    withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import {
    PreloadAllModules,
    RouterModule,
    provideRouter,
    withViewTransitions,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { EffectsModule, provideEffects } from '@ngrx/effects';
import {
    StoreRouterConnectingModule,
    provideRouterStore,
    routerReducer,
} from '@ngrx/router-store';
import { StoreModule, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { ImagesEffects } from '@layout/store/images-store/images.effects';
import { logoReducer } from '@layout/store/images-store/images.reducers';

import { HttpLoadFactory } from '@utils/class/trnaslate-lodader.class';

import {
    TranslateLoader,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';

import { environment } from '../environments/environment.development';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { AuthEffects } from './layout/store/auth-store/auth.effects';
import { authReducer } from './layout/store/auth-store/auth.reducers';
import { darkModeReducer } from './layout/store/dark-mode-store/dark-mode.reducers';
import { experienceDialogReducer } from './layout/store/experience-dialog-store/experience-dialog.reducers';
import { FirebaseEffects } from './layout/store/firebase-store/firebase.effects';
import { firebaseReducer } from './layout/store/firebase-store/firebase.reducers';
import { GithubRepositoriesEffects } from './layout/store/github-projects-store/github-projects.effects';
import { githubRepositoriesReducer } from './layout/store/github-projects-store/github-projects.reducer';
import { languageReducer } from './layout/store/language-selector-store/language.reducers';
import { spinnerReducer } from './layout/store/spinner-store/spinner.reducer';
import { MAIN_ROUTES } from './main.routes';

if (environment.production) {
    enableProdMode();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptorsFromDi(), withFetch()),
        provideRouter(MAIN_ROUTES, withViewTransitions()),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
        provideStorage(() => getStorage()),
        provideAuth(() => getAuth()),
        provideStore(),
        TranslateService,
        importProvidersFrom([
            BrowserModule,
            RouterModule.forRoot(MAIN_ROUTES, {
                preloadingStrategy: PreloadAllModules,
            }),
            StoreModule.forRoot({
                router: routerReducer,
            }),
            TranslateModule.forRoot({
                defaultLanguage: 'en',
                loader: {
                    provide: TranslateLoader,
                    useClass: HttpLoadFactory,
                },
            }),
            EffectsModule.forRoot([
                FirebaseEffects,
                AuthEffects,
                GithubRepositoriesEffects,
                ImagesEffects,
            ]),
            StoreModule.forFeature('logo', logoReducer),
            StoreModule.forFeature('spinner', spinnerReducer),
            StoreModule.forFeature('firebase', firebaseReducer),
            StoreModule.forFeature('darkMode', darkModeReducer),
            StoreModule.forFeature('language', languageReducer),
            StoreModule.forFeature('github', githubRepositoriesReducer),
            StoreModule.forFeature('experience', experienceDialogReducer),
            StoreModule.forFeature('auth', authReducer),
            StoreRouterConnectingModule.forRoot(),
        ]),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true,
        },
        provideClientHydration(
            withHttpTransferCacheOptions({ includePostRequests: true }),
        ),
        provideStore({
            router: routerReducer,
        }),
        provideEffects(),
        provideRouterStore(),
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
};
