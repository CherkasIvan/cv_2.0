export type TFirebaseUser = {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    providerData: Array<{
        uid: string | null;
        displayName: string | null;
        email: string | null;
        photoURL: string | null;
        providerId: string;
    }>;
};
