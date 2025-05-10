import { TProfile } from './profile.type';

export type TAuthState = {
    user: TProfile | null;
    isFetching: boolean;
};
