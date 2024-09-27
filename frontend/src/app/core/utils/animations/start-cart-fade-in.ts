import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const startCardFadeIn = trigger('startCardFadeIn', [
    state('void', style({ opacity: 0 })),
    transition(':leave', [animate('1.5s', style({ opacity: 1 }))]),
]);
