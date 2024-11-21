import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';

import { mainServerRoutes } from '@main.routes.server';

import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
    providers: [
        provideServerRendering(),
        provideServerRoutesConfig(mainServerRoutes),
        provideHttpClient(withFetch()),
    ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
