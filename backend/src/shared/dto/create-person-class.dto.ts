import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PersonClassDto } from './person-class.dto';

export class CreatePersonClassDto {
    @ApiProperty({
        description: 'Уникальный идентификатор',
        example: 1,
    })
    id: number;

    // === Новые поля для имени ===
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

    // Computed property для полного имени (обратная совместимость)
    get name(): string {
        return [this.lastName, this.firstName, this.middleName]
            .filter((part) => part && part.trim())
            .join(' ')
            .trim();
    }

    set name(fullName: string) {
        const parts = fullName.split(' ').filter((part) => part.trim());
        this.lastName = parts[0] || '';
        this.firstName = parts[1] || '';
        this.middleName = parts[2] || '';
    }

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

    // === Поля для отображения (обратная совместимость) ===

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

    // Конструктор для удобного создания DTO
    constructor(partial: Partial<PersonClassDto>) {
        Object.assign(this, partial);
    }

    // Новые методы для работы с именем
    getFullName(): string {
        return this.name;
    }

    setFullName(
        firstName: string,
        lastName: string,
        middleName?: string,
    ): void {
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
    }

    getInitials(): string {
        const first = this.firstName ? this.firstName.charAt(0) : '';
        const last = this.lastName ? this.lastName.charAt(0) : '';
        return `${last}${first}`.toUpperCase();
    }
}
