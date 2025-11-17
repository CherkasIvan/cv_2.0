import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => {
    console.error('Bootstrap error:', err);
    document.body.innerHTML = `
    <h1>Application Failed to Load</h1>
    <p>Check console for errors</p>
    <button onclick="location.reload()">Reload</button>
  `;
});
