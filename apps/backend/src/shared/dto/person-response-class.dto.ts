// dto/person-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PersonEntity } from '@shared/entities/person.entity';

export class PersonResponseClassDto {
    @ApiProperty({
        description: 'Уникальный идентификатор',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Имя',
        example: 'Иван',
    })
    firstName: string;

    @ApiProperty({
        description: 'Фамилия',
        example: 'Иванов',
    })
    lastName: string;

    @ApiPropertyOptional({
        description: 'Отчество',
        example: 'Петрович',
    })
    middleName?: string;

    @ApiProperty({
        description: 'Полное имя пользователя',
        example: 'Иванов Иван Петрович',
    })
    displayName: string;

    @ApiProperty({
        description: 'Должности',
        example: ['Full-stack разработчик', 'Team Lead'],
    })
    positions: string[];

    @ApiProperty({
        description: 'Email адреса',
        example: ['ivan@example.com', 'ivan.work@company.com'],
    })
    emails: string[];

    @ApiPropertyOptional({
        description: 'Номера телефонов',
        example: ['+7 999 123-45-67', '+375 29 123-45-67'],
    })
    phones?: string[];

    @ApiPropertyOptional({
        description: 'URL аватара',
        example: 'images/avatar.jpg',
    })
    avatar?: string;

    @ApiPropertyOptional({
        description: 'Биография',
        example: 'Опытный разработчик с 5+ лет опыта...',
    })
    bio?: string;

    @ApiPropertyOptional({
        description: 'Местоположения',
        example: ['Москва, Россия', 'Минск, Беларусь'],
    })
    locations?: string[];

    @ApiPropertyOptional({
        description: 'Является ли пользователь администратором',
        example: false,
    })
    isAdmin: boolean;

    @ApiPropertyOptional({
        description: 'Активен ли пользователь',
        example: true,
    })
    isActive: boolean;

    @ApiPropertyOptional({
        description: 'Роли пользователя',
        example: ['user'],
    })
    roles: string[];

    @ApiPropertyOptional({
        description: 'Дата создания аккаунта',
    })
    createdAt?: Date;

    @ApiPropertyOptional({
        description: 'Дата последнего обновления',
    })
    updatedAt?: Date;

    @ApiPropertyOptional({
        description: 'Дата последнего входа',
    })
    lastLoginAt?: Date;

    // === Computed properties для обратной совместимости ===

    @ApiProperty({
        description: 'Основная должность (первая из массива)',
        example: 'Full-stack разработчик',
    })
    get position(): string {
        return this.positions?.[0] || '';
    }

    @ApiProperty({
        description: 'Основной email (первый из массива)',
        example: 'ivan@example.com',
    })
    get email(): string {
        return this.emails?.[0] || '';
    }

    @ApiPropertyOptional({
        description: 'Основной телефон (первый из массива)',
        example: '+7 999 123-45-67',
    })
    get phone(): string {
        return this.phones?.[0] || '';
    }

    @ApiPropertyOptional({
        description: 'Основное местоположение (первое из массива)',
        example: 'Москва, Россия',
    })
    get location(): string {
        return this.locations?.[0] || '';
    }

    constructor(person: PersonEntity) {
        this.id = person.id;
        this.firstName = person.firstName;
        this.lastName = person.lastName;
        this.middleName = person.middleName;
        this.displayName = person.name; // Используем computed property из entity
        this.positions = person.positions || [];
        this.emails = person.emails || [];
        this.phones = person.phones || [];
        this.avatar = person.avatar;
        this.bio = person.bio;
        this.locations = person.locations || [];
        this.isAdmin = person.isAdmin;
        this.isActive = person.isActive;
        this.roles = person.roles || ['user'];
        this.createdAt = person.createdAt;
        this.updatedAt = person.updatedAt;
        this.lastLoginAt = person.lastLoginAt;
    }

    // Новые методы для работы с именем
    getFullName(): string {
        return this.displayName;
    }

    getInitials(): string {
        const first = this.firstName ? this.firstName.charAt(0) : '';
        const last = this.lastName ? this.lastName.charAt(0) : '';
        return `${last}${first}`.toUpperCase();
    }
}
