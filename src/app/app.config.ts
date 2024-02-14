import {
    provideHttpClient,
    withFetch,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
    provideClientHydration,
    withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { TitleStrategy, provideRouter } from '@angular/router';

import { CustomTitleStrategy } from './custom-title-strategy';
// import { CustomTitleStrategy } from './custom-title-strategy';
import { MAIN_ROUTES } from './main.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(MAIN_ROUTES),
        provideHttpClient(withInterceptorsFromDi(), withFetch()),
        // { provide: TitleStrategy, useClass: CustomTitleStrategy },
        provideClientHydration(
            withHttpTransferCacheOptions({ includePostRequests: true }),
        ),
    ],
};
