// import {
//     animate,
//     animation,
//     keyframes,
//     style,
//     transition,
//     trigger,
//     useAnimation,
// } from '@angular/animations';
// export const bgLayoutKeyframes = animation(
//     [
//         animate(
//             '{{ timing }}',
//             keyframes([
//                 style({ transform: 'translateY(0)', offset: 0 }),
//                 style({ transform: 'translateY(-90%)', offset: 0.5 }),
//                 style({ transform: 'translateY(0)', offset: 1 }),
//             ]),
//         ),
//     ],
//     { params: { timing: '20s ease-in-out' } },
// );
// export const bgLayoutAnimation = trigger('bgLayoutAnimation', [
//     transition('void => *', [
//         useAnimation(bgLayoutKeyframes, {
//             params: { timing: '20s ease-in-out' },
//         }),
//     ]),
// ]);
import {
    animate,
    keyframes,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

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
