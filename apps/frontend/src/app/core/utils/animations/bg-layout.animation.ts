import { animate, style, transition, trigger } from '@angular/animations';

export const blobFloat = trigger('blobFloat', [
    transition('void => *', [
        animate(
            '5s ease-in-out',
            style({
                transform: 'translateY(0) scale(1)',
                filter: 'blur(0px)',
            }),
        ),
        animate(
            '5s ease-in-out',
            style({
                transform: 'translateY(-100%) scale(1.5)',
                filter: 'blur(10px)',
            }),
        ),
        animate(
            '5s ease-in-out',
            style({
                transform: 'translateY(0) scale(1)',
                filter: 'blur(0px)',
            }),
        ),
    ]),
]);
