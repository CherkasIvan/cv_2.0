import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { INavigation } from '@core/models/navigation.interface';

@Component({
    selector: 'cv-animation-bg',
    standalone: true,
    imports: [NgStyle, NgClass],
    templateUrl: './animation-bg.component.html',
    styleUrl: './animation-bg.component.scss',
})
export class AnimationBgComponent implements OnInit {
    @Input() public navigationLinks: INavigation[] | null = [];
    public animationCircles: any[] = [
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
