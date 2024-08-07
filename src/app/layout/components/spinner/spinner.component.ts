import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { LoadingInterceptor } from '@core/interceptors/loading.interceptor';

import { ISpinner } from '@layout/store/model/spinner.interface';
import { spinnerSelector } from '@layout/store/spinner-store/spinner.selector';

@Component({
    selector: 'cv-spinner',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true,
        },
    ],
})
export class SpinnerComponent {
    public spinnerStyle = input<string>('');
    public loading$: Observable<boolean> = this._store.pipe(
        select(spinnerSelector),
    );

    constructor(private _store: Store<ISpinner>) {}
}
