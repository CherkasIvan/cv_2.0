import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const startCardFadeOut = trigger('startCardFadeOut', [
    state('void', style({ opacity: 1 })),
    transition(':leave', [animate('1.5s', style({ opacity: 0 }))]),
]);
