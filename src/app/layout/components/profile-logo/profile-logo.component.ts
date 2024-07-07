import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'cv-profile-logo',
    standalone: true,
    imports: [],
    templateUrl: './profile-logo.component.html',
    styleUrl: './profile-logo.component.scss',
})
export class ProfileLogoComponent {
    constructor(@Inject(DOCUMENT) private document: Document) {}

    githubNavigation() {
        this.document.defaultView?.open(
            'https://github.com/CherkasIvan',
            '_blank',
        );
    }
}
