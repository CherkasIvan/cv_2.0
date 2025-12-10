import { BG_LAYOUT_CLASSES } from '@assets/animations/css.ts/blob-animations.css';
import { EXPERIENCE_CLASSES } from '@assets/animations/css.ts/experience-animations.css';
import { FADE_CLASSES } from '@assets/animations/css.ts/fade-animations.css';
import { LAVA_LAMP_CLASSES } from '@assets/animations/css.ts/lava-lamp-animations.css';
import { LOGIN_CLASSES } from '@assets/animations/css.ts/login-animations.css';
import { ROUTER_CLASSES } from '@assets/animations/css.ts/router-animations.css';
import { START_CARD_CLASSES } from '@assets/animations/css.ts/start-card-animations.css';
import { TECHNOLOGY_CLASSES } from '@assets/animations/css.ts/technology-animations.css';
import { TRANSLATE_FADE_OUT_CLASSES } from '@assets/animations/css.ts/translate-fade-out.animation.css';

export const ALL_ANIMATION_CLASSES = {
    ...BG_LAYOUT_CLASSES,
    ...EXPERIENCE_CLASSES,
    ...FADE_CLASSES,
    ...LAVA_LAMP_CLASSES,
    ...LOGIN_CLASSES,
    ...ROUTER_CLASSES,
    ...START_CARD_CLASSES,
    ...TECHNOLOGY_CLASSES,
    ...TRANSLATE_FADE_OUT_CLASSES,
} as const;

export type AllAnimationClassType = keyof typeof ALL_ANIMATION_CLASSES;

export {
    BG_LAYOUT_CLASSES,
    EXPERIENCE_CLASSES,
    FADE_CLASSES,
    LAVA_LAMP_CLASSES,
    LOGIN_CLASSES,
    ROUTER_CLASSES,
    START_CARD_CLASSES,
    TECHNOLOGY_CLASSES,
    TRANSLATE_FADE_OUT_CLASSES,
};

export default ALL_ANIMATION_CLASSES;
