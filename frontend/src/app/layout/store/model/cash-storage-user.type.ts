import { TFirebaseUser } from "@core/models/firebase-user.type";

export type TCasheStorageUser = {
    isFirstTime: boolean;
    isGuest: boolean;
    user: TFirebaseUser | null;
    route: string;
    experienceRoute: 'work' | 'education';
    technologiesRoute: 'technologies' | 'other';
    subTechnologiesRoute: 'frontend' | 'backend'; 
    isDark: boolean;
    language: 'ru' | 'en';
};