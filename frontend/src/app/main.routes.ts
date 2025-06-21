import { Routes } from '@angular/router';

import { ERoute } from './core/enum/route.enum';
import { AuthGuard } from './core/utils/guards/auth/auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const MAIN_ROUTES: Routes = [
    { path: '', pathMatch: 'full', redirectTo: `/${ERoute.AUTH}` },
    { path: '**', redirectTo: `/${ERoute.AUTH}` },
    {
        path: ERoute.AUTH,
        loadComponent: () =>
            import('./layout/pages/auth/auth.component').then(
                (c) => c.AuthComponent,
            ),
    },
    {
        path: ERoute.LAYOUT,
        component: LayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./layout/layout.routes').then((c) => c.LAYOUT_ROUTES),
    },
];
