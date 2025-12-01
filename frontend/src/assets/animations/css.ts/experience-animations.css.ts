export const EXPERIENCE_ANIMATIONS = {
    cardHover: 'card-hover-animation',
    cardFadeIn: 'card-fade-in-animation',
    cardImageFade: 'card-image-fade-animation',
    cardSlideIn: 'card-slide-in-animation',
    cardClick: 'card-click-animation',
} as const;

export const EXPERIENCE_CLASSES = {
    cardHover: 'card-hover',
    cardFadeIn: 'card-fade-in',
    cardImageFade: 'card-image-fade',
    cardSlideIn: 'card-slide-in',
    cardClick: 'card-click',
    cardWork: 'card-work',
    cardEducation: 'card-education',
} as const;

export type ExperienceAnimationType = keyof typeof EXPERIENCE_ANIMATIONS;
export type ExperienceClassType = keyof typeof EXPERIENCE_CLASSES;

export default {
    EXPERIENCE_ANIMATIONS,
    EXPERIENCE_CLASSES,
};
