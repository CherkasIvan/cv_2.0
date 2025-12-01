export const LOGIN_ANIMATIONS = {
    loginFadeInOut: 'login-fade-in-out-animation',
    toggleHeight: 'toggle-height-animation',
} as const;

export const LOGIN_CLASSES = {
    loginFadeInOut: 'login-fade-in-out',
    toggleHeight: 'toggle-height',
} as const;

export type LoginAnimationType = keyof typeof LOGIN_ANIMATIONS;
export type LoginClassType = keyof typeof LOGIN_CLASSES;

export default {
    LOGIN_ANIMATIONS,
    LOGIN_CLASSES,
};
