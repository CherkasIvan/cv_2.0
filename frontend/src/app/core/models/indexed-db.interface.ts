import { TProfile } from '@layout/store/model/profile.type';

export interface IIndexedDB {
    id?: number;
    isFirstTime: boolean;
    isGuest: boolean;
    user: TProfile | null;
    rout: {
        experienceRoute: string;
        technologiesRoute: string;
        subTechRoute: string;
        currentRoute: string;
    };
    settings: {
        isDarkMode: boolean;
        language: string;
    };
}
