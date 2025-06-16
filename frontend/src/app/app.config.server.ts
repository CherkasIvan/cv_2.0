import { provideServerRendering } from '@angular/ssr';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';

import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
    providers: [provideServerRendering(), provideHttpClient(withFetch())],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
