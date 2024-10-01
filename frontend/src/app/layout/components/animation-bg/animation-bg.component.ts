import { Observable } from 'rxjs';

import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from '@angular/core';

import { Store, select } from '@ngrx/store';

import { INavigation } from '@core/models/navigation.interface';
import { blobFloat } from '@core/utils/animations/bg-layout.animation';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';
import { TDarkMode } from '@layout/store/model/dark-mode.type';

@Component({
    selector: 'cv-animation-bg',
    standalone: true,
    imports: [NgStyle, NgClass, AsyncPipe],
    templateUrl: './animation-bg.component.html',
    styleUrls: [
        './animation-bg.component.scss',
        './animation-bg-dark-mode/animation-bg-dark-mode.component.scss',
    ],
    animations: [blobFloat],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimationBgComponent implements OnInit {
    @Input() public navigationLinks: INavigation[] | null = [];
    public currentTheme$: Observable<boolean> = this._store$.pipe(
        select(darkModeSelector),
    );

    constructor(private _store$: Store<TDarkMode>) {}

    public animationBlobs: any[] = [
        {
            width: '70px',
            height: '70px',
            'animation-duration': '6s',
        },
        {
            width: '50px',
            height: '50px',
            'animation-duration': '2s',
        },
        {
            width: '100px',
            height: '100px',
            'animation-duration': '4s',
        },
        {
            width: '40px',
            height: '40px',
            'animation-duration': '2.5s',
        },
        {
            width: '90px',
            height: '90px',
            'animation-duration': '2.8s',
        },
        {
            width: '80px',
            height: '80px',
            'animation-duration': '5s',
        },
        {
            width: '65px',
            height: '65px',
            'animation-duration': '3s',
        },
    ];

    ngOnInit(): void {
        // this._startInfiniteAnimation();
    }
}
