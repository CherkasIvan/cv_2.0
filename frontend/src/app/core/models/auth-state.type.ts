import { TAuthResponse } from './auth-response.type';

export type TAuthState = {
    user: TAuthResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
};
