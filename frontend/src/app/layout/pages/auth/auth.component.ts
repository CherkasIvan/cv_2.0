import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { ImagesActions } from '@layout/store/images-store/images.actions';
import {
    selectCloseImageUrl,
    selectWhiteModeImages,
} from '@layout/store/images-store/images.selectors';

import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
    selector: 'cv-auth',
    standalone: true,
    imports: [LoginFormComponent],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
    public isModalDialogVisible: boolean = false;

    public getModalInstance($event: boolean) {
        this.isModalDialogVisible = $event;
    }

    constructor(private _store$: Store) {}

    ngOnInit() {
        this._store$.dispatch(ImagesActions.getCloseImg({ mode: true }));
    }
}
