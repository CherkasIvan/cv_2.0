// blob-animations.const.ts
export const BG_LAYOUT_ANIMATIONS = {
    blobFloat: 'blob-float-animation',
} as const;

export const BG_LAYOUT_CLASSES = {
    blobFloat: 'blob-float',
} as const;

export type BgLayoutAnimationType = keyof typeof BG_LAYOUT_ANIMATIONS;
export type BgLayoutClassType = keyof typeof BG_LAYOUT_CLASSES;

export default {
    BG_LAYOUT_ANIMATIONS,
    BG_LAYOUT_CLASSES,
};
