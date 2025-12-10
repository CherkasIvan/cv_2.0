export const START_CARD_ANIMATIONS = {
    startCardFadeIn: 'start-card-fade-in-animation',
    startCardFadeOut: 'start-card-fade-out-animation',
    startCardPulse: 'pulse-animation',
    startCardBounce: 'bounce-animation',
    startCardShake: 'shake-animation',
} as const;

export const START_CARD_CLASSES = {
    startCardFadeIn: 'start-card-fade-in',
    startCardFadeOut: 'start-card-fade-out',
    startCard: 'start-card',
    startCardGrid: 'start-card-grid',
    startCardLoading: 'loading',
    startCardSuccess: 'success',
    startCardError: 'error',
    initialRender: 'initial-render',
    preloadState: 'preload-state',
} as const;

export type StartCardAnimationType = keyof typeof START_CARD_ANIMATIONS;
export type StartCardClassType = keyof typeof START_CARD_CLASSES;

export default {
    START_CARD_ANIMATIONS,
    START_CARD_CLASSES,
};
