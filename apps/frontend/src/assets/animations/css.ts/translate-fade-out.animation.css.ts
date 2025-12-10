export const TRANSLATE_FADE_OUT_ANIMATIONS = {
    translateFadeOut: 'translate-fade-out-animation',
    translateFadeIn: 'translate-fade-in-animation',
    listAnimation: 'list-stagger-animation',
} as const;

export const TRANSLATE_FADE_OUT_CLASSES = {
    translateFadeOut: 'translate-fade-out',
    translateFadeIn: 'translate-fade-in',
    listStagger: 'list-stagger-translate',
} as const;

export type TranslateFadeAnimationType =
    keyof typeof TRANSLATE_FADE_OUT_ANIMATIONS;
export type TranslateFadeClassType = keyof typeof TRANSLATE_FADE_OUT_CLASSES;

export default {
    TRANSLATE_FADE_OUT_ANIMATIONS,
    TRANSLATE_FADE_OUT_CLASSES,
};
