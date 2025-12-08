import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { TSpinnerState } from '@layout/store/model/spinner-state.type';
import { spinnerSelector } from '@layout/store/spinner-store/spinner.selector';

@Component({
    selector: 'cv-spinner',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
    public spinnerStyle = input<string>('');
    public loading$: Observable<boolean> = this._store$.pipe(
        select(spinnerSelector),
    );

    constructor(private _store$: Store<TSpinnerState>) {}
}