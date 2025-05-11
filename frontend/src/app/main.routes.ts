import { Routes } from '@angular/router';

import { NotFoundComponent } from '@layout/pages/not-found/not-found.component';

import { ERoute } from './core/enum/route.enum';
import { AuthGuard } from './core/utils/guards/auth/auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const MAIN_ROUTES: Routes = [
    { path: '', pathMatch: 'full', redirectTo: `/${ERoute.AUTH}` },
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
    { path: '**', component: NotFoundComponent }, //TODO:Вдбнейшем обыграть это с ролями. Если нет ролии нет роута то отображать ели есть роль то 401 и так далее
    { path: '**', pathMatch: 'full', redirectTo: `/${ERoute.AUTH}` },
];
