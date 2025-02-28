import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const technologyCardFadeIn = trigger('technologyCardFadeIn', [
    state('void', style({ opacity: 0 })),
    transition(
        ':enter',
        [
            style({ opacity: 0 }),
            animate('{{ delay }} ease-in', style({ opacity: 1 })),
        ],
        { params: { delay: '0ms' } },
    ),
]);

export const listAnimation = trigger('listAnimation', [
    transition('* => void', [animate('300ms', style({ opacity: 0 }))]),
    transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
    ]),
]);
