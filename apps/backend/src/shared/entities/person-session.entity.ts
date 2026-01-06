import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { PersonEntity } from './person.entity';

@Entity('person_sessions')
@Index(['accessToken'], { unique: true })
@Index(['refreshToken'], { unique: true })
@Index(['personId'])
export class PersonSessionEntity {
    @ApiProperty({ description: 'Уникальный идентификатор сессии' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'ID пользователя' })
    @Column()
    personId: number;

    @ApiProperty({ description: 'Access token' })
    @Column({ unique: true })
    accessToken: string;

    @ApiProperty({ description: 'Refresh token' })
    @Column({ unique: true })
    refreshToken: string;

    @ApiProperty({ description: 'Время истечения access token' })
    @Column()
    accessTokenExpires: Date;

    @ApiProperty({ description: 'Время истечения refresh token' })
    @Column()
    refreshTokenExpires: Date;

    @ApiProperty({ description: 'IP адрес' })
    @Column({ nullable: true })
    ipAddress: string;

    @ApiProperty({ description: 'User Agent' })
    @Column({ nullable: true })
    userAgent: string;

    @ApiProperty({ description: 'Активна ли сессия' })
    @Column({ default: true })
    isActive: boolean;

    @ApiProperty({ description: 'Дата создания' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Дата обновления' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ description: 'Дата последней активности' })
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    lastActivityAt: Date;

    // Relations
    @ManyToOne(() => PersonEntity, (person) => person.sessions)
    @JoinColumn({ name: 'personId' })
    person: PersonEntity;
}
