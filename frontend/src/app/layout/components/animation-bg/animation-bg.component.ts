// animation-bg.component.ts
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
} from '@angular/core';

import { Store } from '@ngrx/store';

import { TNavigation } from '@core/models/navigation.type';

import { darkModeSelector } from '@layout/store/dark-mode-store/dark-mode.selectors';

import ALL_ANIMATION_CLASSES from '@assets/constant/animations.const';

@Component({
    selector: 'cv-animation-bg',
    standalone: true,
    imports: [NgStyle, NgClass, AsyncPipe],
    templateUrl: './animation-bg.component.html',
    styleUrls: ['./animation-bg.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimationBgComponent {
    private store = inject(Store);

    public navigationLinks = input<TNavigation[] | null>([]);

    public currentTheme$ = this.store.select(darkModeSelector);

    public readonly animationBlobs = [
        { class: 'blob-float-slow', size: '70px' },
        { class: 'blob-float-fast', size: '50px' },
        { class: 'blob-float', size: '100px' },
        { class: 'blob-float-fast', size: '40px' },
        { class: 'blob-float', size: '90px' },
        { class: 'blob-float-slow', size: '80px' },
        { class: 'blob-float', size: '65px' },
    ] as const;

    public readonly cssClasses = ALL_ANIMATION_CLASSES;

    public isVisible = computed(
        () => this.navigationLinks() && this.navigationLinks()!.length > 0,
    );

    // Метод для получения классов blob с учетом темы
    public getBlobClasses(blobClass: string, isDark: boolean): string {
        const themeClass = isDark ? 'blob-dark' : 'blob-light';
        return `${blobClass} ${themeClass}`;
    }
}
