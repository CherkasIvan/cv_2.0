import { timer } from 'rxjs';

import { ChangeDetectorRef, Component } from '@angular/core';

import { LocalStorageService } from '@core/service/local-storage/local-storage.service';

@Component({
    selector: 'cv-first-time',
    standalone: true,
    imports: [],
    templateUrl: './first-time.component.html',
    styleUrl: './first-time.component.scss',
})
export class FirstTimeComponent {
    public isFirstTime: boolean = false;

    constructor(
        private _localStorageService: LocalStorageService,
        private _cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        const userState = this._localStorageService.getUsersState();
        if (userState) {
            this.isFirstTime = userState.isFirstTime;
            if (this.isFirstTime) {
                timer(5000).subscribe(() => {
                    this.isFirstTime = false;
                    this._cdr.detectChanges();
                });
            }
        }
    }
}
