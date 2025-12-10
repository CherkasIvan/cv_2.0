import {
    animate,
    keyframes,
    query,
    stagger,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const listAnimation = trigger('listAnimation', [
    transition('* => *', [
        query(
            ':leave',
            stagger('300ms', [
                animate(
                    '1s ease-out',
                    keyframes([
                        style({
                            opacity: 1,
                            transform: 'translateY(0)',
                            offset: 0,
                        }),
                        style({
                            opacity: 0.5,
                            transform: 'translateY(35px)',
                            offset: 0.3,
                        }),
                        style({
                            opacity: 0,
                            transform: 'translateY(-75%)',
                            offset: 1.0,
                        }),
                    ]),
                ),
            ]),
            { optional: true },
        ),
        query(
            ':enter',
            stagger('300ms', [
                animate(
                    '1s ease-in',
                    keyframes([
                        style({
                            opacity: 0,
                            transform: 'translateY(-75%)',
                            offset: 0,
                        }),
                        style({
                            opacity: 0.5,
                            transform: 'translateY(35px)',
                            offset: 0.3,
                        }),
                        style({
                            opacity: 1,
                            transform: 'translateY(0)',
                            offset: 1.0,
                        }),
                    ]),
                ),
            ]),
            { optional: true },
        ),
    ]),
]);
