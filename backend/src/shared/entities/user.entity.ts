import * as bcrypt from 'bcrypt';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('users')
export class UserEntity {
    @ApiProperty({ description: 'Firebase UID пользователя' })
    @PrimaryColumn()
    uid: string;

    @ApiProperty({ description: 'Email пользователя' })
    @Column({ nullable: true })
    email: string;

    @ApiPropertyOptional({ description: 'Отображаемое имя пользователя' })
    @Column({ nullable: true })
    displayName?: string;

    @ApiPropertyOptional({ description: 'URL фотографии' })
    @Column({ nullable: true })
    photoURL?: string;

    @ApiPropertyOptional({ description: 'Дата создания аккаунта' })
    @Column({ nullable: true })
    createdAt?: string;

    @ApiPropertyOptional({ description: 'Дата последнего входа' })
    @Column({ nullable: true })
    lastLoginAt?: string;

    @ApiPropertyOptional({ description: 'Хэш пароля' })
    @Column({ nullable: true })
    password?: string;

    @ApiPropertyOptional({
        description: 'Является ли пользователь администратором',
    })
    @Column({ default: false })
    isAdmin: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const saltRounds = 12;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        if (!this.password) return false;
        return bcrypt.compare(password, this.password);
    }
}
