import { ApiProperty } from '@nestjs/swagger';

export class RepositoryClassDto {
    @ApiProperty({ 
        description: 'Уникальный идентификатор', 
        example: 'repo1' 
    })
    id: string;

    @ApiProperty({ 
        description: 'Название репозитория', 
        example: 'portfolio-backend' 
    })
    name: string;

    @ApiProperty({ 
        description: 'Описание репозитория', 
        example: 'Backend для портфолио сайта' 
    })
    description: string;

    @ApiProperty({ 
        description: 'URL репозитория', 
        example: 'https://github.com/user/portfolio-backend' 
    })
    url: string;

    @ApiProperty({ 
        description: 'Основной язык программирования', 
        required: false,
        example: 'TypeScript' 
    })
    language?: string;

    @ApiProperty({ 
        description: 'Количество звезд', 
        required: false,
        example: 15 
    })
    stars?: number;

    @ApiProperty({ 
        description: 'Количество форков', 
        required: false,
        example: 3 
    })
    forks?: number;

    @ApiProperty({ 
        description: 'Дата последнего обновления', 
        required: false,
        example: '2024-01-15T10:30:00.000Z' 
    })
    updatedAt?: string;

    @ApiProperty({ 
        description: 'Темы репозитория', 
        type: [String],
        required: false,
        example: ['nestjs', 'postgresql', 'swagger'] 
    })
    topics?: string[];
}