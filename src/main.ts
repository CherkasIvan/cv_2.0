import {
    provideHttpClient,
    withFetch,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { MAIN_ROUTES } from '@app/main.routes';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        provideHttpClient(withInterceptorsFromDi(), withFetch()),
        provideAnimations(),
        provideRouter(MAIN_ROUTES),
        // importProvidersFrom(
        //     AngularFireModule.initializeApp(environment.firebase),
        //     provideFirebaseApp(() => initializeApp(environment.firebase)),
        //     provideAuth(() => getAuth()),
        //     provideFirestore(() => getFirestore()),
        //     provideDatabase(() => getDatabase()),
        // ),
        // { provide: TitleStrategy, useClass: CustomTitleStrategy },
        // provideClientHydration(
        //     withHttpTransferCacheOptions({ includePostRequests: true }),
        // ),
    ],
})
    .then(() => {})
    .catch((err) => console.error(err));
