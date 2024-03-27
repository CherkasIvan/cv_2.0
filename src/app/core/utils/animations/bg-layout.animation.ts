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
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const bgLayoutAnimation = trigger('bgLayoutAnimation', [
    // Определение состояний для бесконечной анимации
    state('start', style({ transform: 'translateY(0)' })),
    state('end', style({ transform: 'translateY(-90%)' })),
    // Переходы между состояниями
    transition('start => end', animate('20s ease-in-out')),
    transition('end => start', animate('20s ease-in-out')),
]);
