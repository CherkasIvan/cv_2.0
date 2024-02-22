import { Injectable } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {
    override updateTitle(routerState: RouterStateSnapshot) {
        const title = this.buildTitle(routerState);
        if (title !== undefined) {
            document.title = `Cherkas Ivan - ${title}`;
        } else {
            document.title = `Cherkas Ivan CV_2.0 - Home`;
        }
    }
}
