import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { TitleStrategy, provideRouter } from '@angular/router';

import { mainRoutes } from './mainRoutes.routes';
import { provideHttpClient } from '@angular/common/http';
import { CustomTitleStrategy } from './custom-title-strategy';

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(mainRoutes), provideHttpClient(),
      { provide: TitleStrategy, useClass: CustomTitleStrategy },
      provideClientHydration()
    ],
};
