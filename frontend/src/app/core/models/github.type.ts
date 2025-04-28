export type TGitHub = {
    name: string;
    stars: number | null;
    htmlUrl: string;
    forks: number | null;
    description: string | null;
    created_at: string | null;
    updated_at: string | null;
    languages?: { [key: string]: number };
    private: boolean;
    page?: number;
    perPage?: number;
};
