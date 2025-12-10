import * as bcrypt from 'bcrypt';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PersonSessionEntity } from './person-session.entity';
import { PersonStateEntity } from './person-state.entity';

@Entity('persons')
export class PersonEntity {
    @ApiProperty({ description: 'Уникальный идентификатор', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Имя', example: 'Иван' })
    @Column({ nullable: true })
    firstName: string;

    @ApiProperty({ description: 'Фамилия', example: 'Иванов' })
    @Column({ nullable: true })
    lastName: string;

    @ApiPropertyOptional({ description: 'Отчество', example: 'Петрович' })
    @Column({ nullable: true })
    middleName?: string;

    // Computed property для полного имени
    get name(): string {
        return [this.lastName, this.firstName, this.middleName]
            .filter((part) => part && part.trim())
            .join(' ')
            .trim();
    }

    @ApiProperty({
        description: 'Должности',
        example: ['Full-stack разработчик'],
    })
    @Column('text', { array: true, nullable: true, default: '{}' })
    positions: string[];

    @ApiProperty({ description: 'Email адреса', example: ['ivan@example.com'] })
    @Column('text', { array: true, nullable: true, default: '{}' })
    emails: string[];

    @ApiProperty({
        description: 'Email для логина',
        example: 'ivan@example.com',
    })
    @Column({ unique: true, nullable: true })
    loginEmail: string;

    @ApiProperty({ description: 'Пароль', example: 'hashedPassword' })
    @Column({ nullable: true })
    password?: string;

    @ApiPropertyOptional({ description: 'Телефоны', example: ['+79991234567'] })
    @Column('text', { array: true, nullable: true, default: '{}' })
    phones?: string[];

    @ApiPropertyOptional({ description: 'Аватар', example: 'avatar.jpg' })
    @Column({ nullable: true })
    avatar?: string;

    @ApiPropertyOptional({
        description: 'Биография',
        example: 'Опытный разработчик',
    })
    @Column({ nullable: true })
    bio?: string;

    @ApiPropertyOptional({ description: 'Местоположения', example: ['Москва'] })
    @Column('text', { array: true, nullable: true, default: '{}' })
    locations?: string[];

    @ApiPropertyOptional({ description: 'Администратор', example: false })
    @Column({ default: false })
    isAdmin: boolean;

    @ApiPropertyOptional({ description: 'Активен', example: true })
    @Column({ default: true })
    isActive: boolean;

    @ApiPropertyOptional({ description: 'Роли', example: ['user'] })
    @Column('text', { array: true, default: ['user'] })
    roles: string[];

    @ApiPropertyOptional({ description: 'Дата создания' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiPropertyOptional({ description: 'Дата обновления' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiPropertyOptional({ description: 'Дата последнего входа' })
    @Column({ nullable: true })
    lastLoginAt?: Date;

    @ApiPropertyOptional({
        description: 'Количество неудачных попыток входа',
        example: 0,
    })
    @Column({ default: 0 })
    failedLoginAttempts: number;

    @ApiPropertyOptional({ description: 'Заблокирован до' })
    @Column({ nullable: true })
    lockedUntil?: Date;

    @ApiPropertyOptional({ description: 'Токен сброса пароля' })
    @Column({ nullable: true })
    resetPasswordToken?: string;

    @ApiPropertyOptional({ description: 'Срок действия токена сброса пароля' })
    @Column({ nullable: true })
    resetPasswordExpires?: Date;

    @ApiPropertyOptional({ description: 'Заблокирован' })
    @Column({ default: false })
    isLocked: boolean;

    // 🎯 Relations
    @ApiPropertyOptional({ description: 'Сессии пользователя' })
    @OneToMany(() => PersonSessionEntity, (session) => session.person)
    sessions: PersonSessionEntity[];

    @OneToOne(() => PersonStateEntity, (state) => state.person)
    state: PersonStateEntity;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const saltRounds = 10;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
    }

    async validatePassword(plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, this.password);
    }

    canLogin(): { canLogin: boolean; reason?: string } {
        if (!this.isActive) {
            return { canLogin: false, reason: 'Аккаунт деактивирован' };
        }
        if (this.lockedUntil && this.lockedUntil > new Date()) {
            return { canLogin: false, reason: 'Аккаунт временно заблокирован' };
        }
        return { canLogin: true };
    }

    incrementFailedAttempts(): void {
        this.failedLoginAttempts += 1;
        if (this.failedLoginAttempts >= 5) {
            // Блокируем на 30 минут
            this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        }
    }

    resetFailedAttempts(): void {
        this.failedLoginAttempts = 0;
        this.lockedUntil = null;
    }

    getInitials(): string {
        const first = this.firstName ? this.firstName.charAt(0) : '';
        const last = this.lastName ? this.lastName.charAt(0) : '';
        return `${last}${first}`.toUpperCase();
    }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   