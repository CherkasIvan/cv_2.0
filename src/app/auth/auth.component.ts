import { Component } from '@angular/core';

import { AuthMainComponent } from './components/auth-main/auth-main.component';
import { FooterLinksComponent } from './components/footer-links/footer-links.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
    selector: 'cv-auth',
    standalone: true,
    imports: [AuthMainComponent, FooterLinksComponent, HeaderComponent],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
})
export class AuthComponent {}
