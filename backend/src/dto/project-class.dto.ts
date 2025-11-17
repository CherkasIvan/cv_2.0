import { ApiProperty } from '@nestjs/swagger';

export class ProjectClassDto {
    @ApiProperty({ 
        description: 'Уникальный идентификатор', 
        example: 'proj1' 
    })
    id: string;

    @ApiProperty({ 
        description: 'Название проекта', 
        example: 'Портфолио сайт' 
    })
    title: string;

    @ApiProperty({ 
        description: 'Описание проекта', 
        example: 'Веб-сайт для демонстрации проектов и навыков' 
    })
    description: string;

    @ApiProperty({ 
        description: 'Используемые технологии', 
        type: [String],
        required: false,
        example: ['React', 'Node.js', 'PostgreSQL'] 
    })
    technologies?: string[];

    @ApiProperty({ 
        description: 'Ссылка на GitHub', 
        required: false,
        example: 'https://github.com/user/project' 
    })
    githubUrl?: string;

    @ApiProperty({ 
        description: 'Ссылка на живое демо', 
        required: false,
        example: 'https://project.example.com' 
    })
    liveUrl?: string;

    @ApiProperty({ 
        description: 'Массив изображений проекта', 
        type: [String],
        required: false,
        example: ['project1.jpg', 'project2.jpg'] 
    })
    images?: string[];

    @ApiProperty({ 
        description: 'Альтернативный текст', 
        required: false,
        example: 'Скриншот проекта' 
    })
    alt?: string;

    @ApiProperty({ 
        description: 'Категория проекта', 
        required: false,
        example: 'веб-разработка' 
    })
    category?: string;

    @ApiProperty({ 
        description: 'Статус проекта', 
        required: false,
        example: 'Завершен' 
    })
    status?: string;

    @ApiProperty({ 
        description: 'Дата начала', 
        required: false,
        example: 'Январь 2023' 
    })
    startDate?: string;

    @ApiProperty({ 
        description: 'Дата окончания', 
        required: false,
        example: 'Март 2023' 
    })
    endDate?: string;
}