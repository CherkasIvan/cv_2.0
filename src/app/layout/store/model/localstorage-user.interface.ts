import { TProfile } from './profile.type';

export type TLocalstorageUser = {
    isFirstTime: boolean;
    isGuest: boolean;
    user?: TProfile | null;
    route: string;
    isDark: boolean;
    language: 'ru' | 'en';
};
