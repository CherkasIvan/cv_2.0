// app.routes.ts
import { Routes } from '@angular/router';
import { ERoute } from './core/enum/route.enum';
import { AuthGuard } from './core/utils/guards/auth/auth.guard';
import { NoAuthGuard } from '@core/utils/guards/no-auth/no-auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const MAIN_ROUTES: Routes = [
  // Remove the catch-all redirect that conflicts
  // { path: '**', redirectTo: `/${ERoute.AUTH}` }, // ⛔ REMOVE THIS
  
  {
    path: '',
    redirectTo: ERoute.AUTH,
    pathMatch: 'full'
  },
  {
    path: ERoute.AUTH,
    canActivate: [NoAuthGuard],
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
  // Add catch-all at the end, but only for client-side navigation
  {
    path: '**',
    redirectTo: ERoute.AUTH
  }
];