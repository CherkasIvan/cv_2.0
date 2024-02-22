import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';

import { CustomTitleStrategy } from './custom-title-strategy';
import { MAIN_ROUTES } from './main.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(MAIN_ROUTES),
        provideHttpClient(),
        { provide: TitleStrategy, useClass: CustomTitleStrategy },
    ],
};
