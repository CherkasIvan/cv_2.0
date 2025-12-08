import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePersonClassDto {
    @ApiPropertyOptional({ description: 'Имя', example: 'Иван' })
    firstName?: string;

    @ApiPropertyOptional({ description: 'Фамилия', example: 'Иванов' })
    lastName?: string;

    @ApiPropertyOptional({ description: 'Отчество', example: 'Петрович' })
    middleName?: string;

    @ApiPropertyOptional({
        description: 'Должности',
        example: ['Full-stack разработчик', 'Team Lead'],
    })
    positions?: string[];

    @ApiPropertyOptional({
        description: 'Email адреса',
        example: ['ivan@example.com', 'ivan.work@company.com'],
    })
    emails?: string[];

    @ApiPropertyOptional({
        description: 'Номера телефонов',
        example: ['+7 999 123-45-67'],
    })
    phones?: string[];

    @ApiPropertyOptional({
        description: 'URL аватара',
        example: 'images/new-avatar.jpg',
    })
    avatar?: string;

    @ApiPropertyOptional({
        description: 'Биография',
        example: 'Опытный разработчик с 5+ лет опыта...',
    })
    bio?: string;

    @ApiPropertyOptional({
        description: 'Местоположения',
        example: ['Москва, Россия'],
    })
    locations?: string[];

    @ApiPropertyOptional({
        description: 'Основной email для логина',
        example: 'new-email@example.com',
    })
    loginEmail?: string;

    @ApiPropertyOptional({
        description: 'Является ли пользователь администратором',
        example: false,
    })
    isAdmin?: boolean;

    @ApiPropertyOptional({
        description: 'Активен ли пользователь',
        example: true,
    })
    isActive?: boolean;

    @ApiPropertyOptional({
        description: 'Роли пользователя',
        example: ['user', 'editor'],
    })
    roles?: string[];
}
