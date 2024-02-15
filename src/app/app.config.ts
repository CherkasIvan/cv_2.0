import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import {
    provideHttpClient,
    withFetch,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideFirestore } from '@angular/fire/firestore';
import {
    provideClientHydration,
    withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TitleStrategy, provideRouter } from '@angular/router';

import { environment } from '../assets/utils/environments/environment.development';
import { CustomTitleStrategy } from './custom-title-strategy';
// import { CustomTitleStrategy } from './custom-title-strategy';
import { MAIN_ROUTES } from './main.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideRouter(MAIN_ROUTES),
        importProvidersFrom(
            AngularFireModule.initializeApp(environment.firebase),
            provideFirebaseApp(() => initializeApp(environment.firebase)),
            provideAuth(() => getAuth()),
            provideFirestore(() => getFirestore()),
            provideDatabase(() => getDatabase()),
        ),
        provideHttpClient(withInterceptorsFromDi(), withFetch()),
        // { provide: TitleStrategy, useClass: CustomTitleStrategy },
        provideClientHydration(
            withHttpTransferCacheOptions({ includePostRequests: true }),
        ),
    ],
};
