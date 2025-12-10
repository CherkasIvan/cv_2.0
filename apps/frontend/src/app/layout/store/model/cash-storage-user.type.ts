import { TProfile } from './profile.type';

export type TCasheStorageUser = {
    isFirstTime: boolean;
    isGuest: boolean;
    user?: TProfile | null;
    route: string;
    experiencERoute: 'work' | 'education';
    technologiesRoute: 'technologies' | 'other';
    subTechnologiesRoute: 'frontend' | 'backend';
    isDark: boolean;
    language: 'ru' | 'en';
};
