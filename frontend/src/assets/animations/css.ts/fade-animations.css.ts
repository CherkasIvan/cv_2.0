export const FADE_ANIMATIONS = {
    fadeInOut: 'fade-in-out-animation',
    fadeInOutCards: 'fade-in-out-cards-animation',
} as const;

export const FADE_CLASSES = {
    fadeInOut: 'fade-in-out',
    fadeInOutCards: 'fade-in-out-cards',
} as const;

export type FadeAnimationType = keyof typeof FADE_ANIMATIONS;
export type FadeClassType = keyof typeof FADE_CLASSES;

export default {
    FADE_ANIMATIONS,
    FADE_CLASSES,
};
