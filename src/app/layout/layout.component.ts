import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthComponent } from './pages/auth/auth.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [FooterComponent, HeaderComponent, RouterOutlet, AuthComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
