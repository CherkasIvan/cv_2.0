export const ROUTER_ANIMATIONS = {
    routeEnter: 'route-enter-animation',
    routeLeave: 'route-leave-animation',
} as const;

export const ROUTER_CLASSES = {
    routeEnter: 'route-enter',
    routeLeave: 'route-leave',
} as const;

export type RouterAnimationType = keyof typeof ROUTER_ANIMATIONS;
export type RouterClassType = keyof typeof ROUTER_CLASSES;

export default {
    ROUTER_ANIMATIONS,
    ROUTER_CLASSES,
};
