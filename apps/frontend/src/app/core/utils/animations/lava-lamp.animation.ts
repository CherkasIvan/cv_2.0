import {
    animate,
    keyframes,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const lavaLampAnimation = trigger('lavaLamp', [
    transition('void => *', [
        animate(
            '8s infinite ease-in-out',
            keyframes([
                style({ transform: 'translateY(0px) scale(1)', offset: 0 }),
                style({
                    transform: 'translateY(-60px) scale(1.2)',
                    offset: 0.5,
                }),
                style({ transform: 'translateY(-120px) scale(1)', offset: 1 }),
            ]),
        ),
    ]),
    transition('* => void', [
        animate(
            '8s infinite ease-in-out',
            keyframes([
                style({ transform: 'translateY(0px) scale(1)', offset: 0 }),
                style({
                    transform: 'translateY(60px) scale(0.8)',
                    offset: 0.5,
                }),
                style({ transform: 'translateY(120px) scale(1)', offset: 1 }),
            ]),
        ),
    ]),
]);
