import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const fadeInOutCards = trigger('fadeInOutCards', [
    state(
        'void',
        style({
            opacity: 0,
        }),
    ),
    transition('void <=> *', [animate(300)]),
]);
