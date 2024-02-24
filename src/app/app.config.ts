import { initializeApp } from 'firebase/app';
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
} from '@angular/core';
import {
    ScreenTrackingService,
    UserTrackingService,
} from '@angular/fire/analytics';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFireModule } from '@angular/fire/compat';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
    BrowserModule,
    provideClientHydration,
    withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    TitleStrategy,
    provideRouter,
    withViewTransitions,
} from '@angular/router';

import { CustomTitleStrategy } from './custom-title-strategy';
import { environment } from './layout/environments/environment.development';
import { MAIN_ROUTES } from './main.routes';

if (environment.production) {
    enableProdMode();
}

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(BrowserModule),
        provideHttpClient(withInterceptorsFromDi(), withFetch()),
        provideAnimations(),
        provideRouter(MAIN_ROUTES, withViewTransitions()),
        importProvidersFrom(
            // AngularFireModule.initializeApp(environment.firebase),
            provideFirebaseApp(
                () => initializeApp(environment.firebase),
                provideAuth(() => getAuth()),
                provideFirestore(() => getFirestore()),
                provideDatabase(() => getDatabase()),
                provideStorage(() => getStorage()),
                { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
            ),
        ),
        provideClientHydration(
            withHttpTransferCacheOptions({ includePostRequests: true }),
        ),
        // { provide: TitleStrategy, useClass: CustomTitleStrategy },
    ],
};
