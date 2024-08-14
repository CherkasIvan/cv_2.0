import { TProfile } from '@layout/store/model/profile.type';

export interface ILocalStorage {
    previousUser: TProfile | null;
    user: TProfile | null;
    rout: string;
    isDarkMode: string;
    // isLanguage: string;
}
