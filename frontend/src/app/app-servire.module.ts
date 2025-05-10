import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppComponent } from './app.component';

@NgModule({
    imports: [AppComponent, ServerModule],
})
export class AppServerModule {}
