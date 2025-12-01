import { TAuthResponseState } from './auth-response-state.type';

export type TAuthState = {
    user: TAuthResponseState | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
};
