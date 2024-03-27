import { Component, OnInit } from '@angular/core';

import { bgLayoutAnimation } from '@core/utils/animations/bg-layout.animation';

@Component({
    selector: 'cv-animation-bg',
    standalone: true,
    animations: [bgLayoutAnimation],
    imports: [],
    templateUrl: './animation-bg.component.html',
    styleUrl: './animation-bg.component.scss',
})
export class AnimationBgComponent implements OnInit {
    public animationState: string = 'start';
    private _toggleAnimationState() {
        this.animationState = this.animationState === 'start' ? 'end' : 'start';
    }

    private _startInfiniteAnimation() {
        setInterval(() => {
            this._toggleAnimationState();
        }, 20000);
    }

    ngOnInit(): void {
        // this._startInfiniteAnimation();
    }
}
