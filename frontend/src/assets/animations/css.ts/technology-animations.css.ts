export const TECHNOLOGY_ANIMATIONS = {
    technologyCardFadeIn: 'technology-card-fade-in-animation',
    listAnimation: 'list-stagger-animation',
} as const;

export const TECHNOLOGY_CLASSES = {
    technologyCardFadeIn: 'technology-card-fade-in',
    listStagger: 'list-stagger',
} as const;

export type TechnologyAnimationType = keyof typeof TECHNOLOGY_ANIMATIONS;
export type TechnologyClassType = keyof typeof TECHNOLOGY_CLASSES;

export default {
    TECHNOLOGY_ANIMATIONS,
    TECHNOLOGY_CLASSES,
};
