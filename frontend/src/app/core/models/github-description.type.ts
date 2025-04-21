export type TGitHubDescription = {
    repo_name: string;
    repoUrl: string;
    imgUrl: string[];
    private?: boolean;
    repo_type: '        ' | 'application' | 'native';
    ghPageUrl: string | null;
    description: string | null;
    framework?: string | null;
    videoUrl?: string;
};
