export type TAuthResponse = {
    id: number;
    name: string;
    loginEmail: string;
    emails: string[];
    phones: string[];
    roles: string[];
    positions: string[];
    locations: string[];
    avatar: string;
    user: any; // или более конкретный тип
    token: string;
};
