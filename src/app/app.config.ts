import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import {
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
import {
    ScreenTrackingService,
    UserTrackingService,
} from '@angular/fire/analytics';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
    BrowserModule,
    provideClientHydration,
    withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import {
    BrowserAnimationsModule,
    provideAnimations,
} from '@angular/platform-browser/animations';
import {
    TitleStrategy,
    provideRouter,
    withViewTransitions,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { CustomTitleStrategy } from './custom-title-strategy';
import { environment } from './layout/environments/environment.development';
import { MAIN_ROUTES } from './main.routes';

if (environment.production) {
    enableProdMode();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptorsFromDi(), withFetch()),
        provideAnimations(),
        provideRouter(MAIN_ROUTES, withViewTransitions()),
        importProvidersFrom([
            AngularFireModule.initializeApp(environment.firebase),
            AngularFireDatabaseModule,
            BrowserModule,
            BrowserAnimationsModule,
            provideStorage(() => getStorage()),
            provideAuth(() => getAuth()),
            provideFirestore(() => getFirestore()),
            provideDatabase(() => getDatabase()),
            provideFirebaseApp(() => initializeApp(environment.firebase)),
        ]),
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
