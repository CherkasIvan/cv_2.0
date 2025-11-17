import { ApiProperty } from '@nestjs/swagger';

export class ProjectsAsideClassDto {
    @ApiProperty({ 
        description: 'Уникальный идентификатор', 
        example: 1 
    })
    id: number;

    @ApiProperty({ 
        description: 'Приватность проекта', 
        example: false 
    })
    isPrivate: boolean;

    @ApiProperty({ 
        description: 'Тип проекта', 
        enum: ['all', 'public', 'private'],
        example: 'public' 
    })
    value: 'all' | 'public' | 'private';

    @ApiProperty({ 
        description: 'Заголовок проекта', 
        example: 'Все проекты' 
    })
    title: string;
}