// entities/auth-session.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('auth_sessions')
export class AuthSessionEntity {
    @ApiProperty({ description: 'Уникальный идентификатор сессии', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Firebase UID пользователя', example: 'abc123def456' })
    @Column({ nullable: true })
    uid: string;

    @ApiProperty({ description: 'Email пользователя', example: 'user@example.com' })
    @Column({ nullable: true })
    email: string;

    @ApiProperty({ description: 'JWT токен', required: false, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    @Column({ nullable: true })
    token?: string;

    @ApiProperty({ description: 'Дата создания сессии', example: '2024-01-15T10:30:00.000Z' })
    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    createdAt: Date;
}