import { Routes } from '@angular/router';

import { ERoute } from './core/enum/route.enum';
import { LayoutComponent } from './layout/layout.component';

export const MAIN_ROUTES: Routes = [
    { path: '', pathMatch: 'full', redirectTo: `/${ERoute.LAYOUT}` }, //`/${ERouterPath.AUTH}` },
    {
        path: ERoute.LAYOUT, //ERouterPath.LAYOUT,
        component: LayoutComponent,
        // canActivate: [AuthGuard],

        loadChildren: () =>
            import('./layout/layout.routes').then((c) => c.LAYOUT_ROUTES),
    },
];
