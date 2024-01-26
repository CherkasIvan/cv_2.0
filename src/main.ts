import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { mainRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {providers:[
  provideHttpClient(withInterceptorsFromDi()),
  provideRouter(mainRoutes),
]}).catch((err) =>
    console.error(err),
);
