import {
    AnimationTriggerMetadata,
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const loginFadeInOut: AnimationTriggerMetadata = trigger(
    'loginFadeInOut',
    [
        state('in', style({ opacity: 1 })),
        transition(':leave', [animate('2s', style({ opacity: 0 }))]),
        transition(':enter', [
            style({ opacity: 0 }),
            animate('2s', style({ opacity: 1 })),
        ]),
    ],
);

export const toggleHeight = trigger('toggleHeight', [
    state('expanded', style({ height: '*' })),
    state('collapsed', style({ height: '0px', overflow: 'hidden' })),
    transition('expanded <=> collapsed', [animate('0.5s ease-in-out')]),
]);
