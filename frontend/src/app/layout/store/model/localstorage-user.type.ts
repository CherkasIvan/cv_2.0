import { TProfile } from './profile.type';

export type TLocalstorageUser = {
    isFirstTime: boolean;
    isGuest: boolean;
    user?: TProfile | null;
    currentRoute: string;
    experienceRoute: 'work' | 'education';
    technologiesRoute: 'technologies' | 'other';
    subTechnologiesRoute: 'frontend' | 'backend';
    isDark: boolean;
    language: 'ru' | 'en';
};
