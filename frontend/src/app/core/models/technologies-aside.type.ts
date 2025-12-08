import { THardSkillsNav } from './hard-skills-nav.type';

export type TTechnologiesAside = {
    id: number;
    title: string;
    value: 'technologies' | 'other';
    imgName?: string;
    images?: string[];
    hardSkills?: THardSkillsNav[];
};
