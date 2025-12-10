import { TFirebaseUser } from '@core/models/firebase-user.type';

export type TCasheStorageUserState = {
    isFirstTime: boolean;
    isGuest: boolean;
    user: TFirebaseUser | null;
    route: string;
    experiencERoute: 'work' | 'education';
    technologiesRoute: 'technologies' | 'other';
    subTechnologiesRoute: 'frontend' | 'backend';
    isDark: boolean;
    language: 'ru' | 'en';
};
