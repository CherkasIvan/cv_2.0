// entities/user.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('users')
export class UserEntity {
  @ApiProperty({ description: 'Firebase UID пользователя' })
  @PrimaryColumn()
  uid: string;

  @ApiProperty({ description: 'Email пользователя' })
  @Column({ nullable: true })
  email: string;

  @ApiPropertyOptional({ description: 'Отображаемое имя' })
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
}