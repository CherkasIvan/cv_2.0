export type TRegistrationForm = {
    name: string;
    positions: string[];
    emails: string[];
    phones: string[];
    loginEmail: string;
    password: string;
    confirmPassword: string;
    bio?: string;
    locations?: string[];
};
