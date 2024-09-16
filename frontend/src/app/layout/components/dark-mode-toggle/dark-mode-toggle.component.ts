import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { setModeSuccess } from '@layout/store/dark-mode-store/dark-mode.actions';
import { IDarkMode } from '@layout/store/model/dark-mode.interface';
import { TLocalstorageUser } from '@layout/store/model/localstorage-user.type';

@Component({
    selector: 'cv-dark-mode-toggle',
    standalone: true,
    imports: [NgClass],
    templateUrl: './dark-mode-toggle.component.html',
    styleUrl: './dark-mode-toggle.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeToggleComponent implements OnInit {
    public isChecked: boolean = false;

    public changeView(): void {
        this.isChecked = !this.isChecked;
        this._store$.dispatch(setModeSuccess(this.isChecked));
    }

    constructor(private _store$: Store<IDarkMode | TLocalstorageUser>) {}

    ngOnInit(): void {
        const userState = localStorage.getItem('usersState');
        if (userState !== null) {
            const parsedUserState: TLocalstorageUser = JSON.parse(userState);
            this.isChecked = parsedUserState.isDark;
        }
    }
}
