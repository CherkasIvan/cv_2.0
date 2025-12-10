export const LAVA_LAMP_ANIMATIONS = {
    lavaLamp: 'lava-lamp-animation',
    lavaLampLeave: 'lava-lamp-leave-animation',
} as const;

export const LAVA_LAMP_CLASSES = {
    lavaLamp: 'lava-lamp',
    lavaLampLeave: 'lava-lamp-leave',
} as const;

export type LavaLampAnimationType = keyof typeof LAVA_LAMP_ANIMATIONS;
export type LavaLampClassType = keyof typeof LAVA_LAMP_CLASSES;

export default {
    LAVA_LAMP_ANIMATIONS,
    LAVA_LAMP_CLASSES,
};
