import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const technologyCardFadeIn = trigger('technologyCardFadeIn', [
    state('void', style({ opacity: 0 })),
    transition(':enter', [animate('300ms ease-in', style({ opacity: 1 }))]),
]);
