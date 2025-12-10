// src/migrations/1733000000000-CreatePersonSessionAndStateTables.ts
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePersonSessionAndStateTables1733000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание таблицы person_sessions
    await queryRunner.createTable(new Table({
      name: 'person_sessions',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'personId',
          type: 'int',
        },
        {
          name: 'accessToken',
          type: 'varchar',
          length: '255',
          isUnique: true,
        },
        {
          name: 'refreshToken',
          type: 'varchar',
          length: '255',
          isUnique: true,
        },
        {
          name: 'accessTokenExpires',
          type: 'timestamp',
        },
        {
          name: 'refreshTokenExpires',
          type: 'timestamp',
        },
        {
          name: 'ipAddress',
          type: 'varchar',
          length: '45',
          isNullable: true,
        },
        {
          name: 'userAgent',
          type: 'text',
          isNullable: true,
        },
        {
          name: 'isActive',
          type: 'boolean',
          default: true,
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updatedAt',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'lastActivityAt',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    }));

    // Создание таблицы person_states
    await queryRunner.createTable(new Table({
      name: 'person_states',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'personId',
          type: 'int',
          isUnique: true,
        },
        {
          name: 'isOnline',
          type: 'boolean',
          default: false,
        },
        {
          name: 'lastActiveAt',
          type: 'timestamp',
          isNullable: true,
        },
        {
          name: 'status',
          type: 'varchar',
          length: '50',
          isNullable: true,
        },
        {
          name: 'state',
          type: 'jsonb',
          isNullable: true,
        },
        {
          name: 'metadata',
          type: 'jsonb',
          isNullable: true,
        },
        {
          name: 'createdAt',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updatedAt',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    }));

    // Создание внешних ключей
    await queryRunner.createForeignKey('person_sessions', new TableForeignKey({
      columnNames: ['personId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'persons',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('person_states', new TableForeignKey({
      columnNames: ['personId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'persons',
      onDelete: 'CASCADE',
    }));

    // Создание индексов с использованием TableIndex
    await queryRunner.createIndex('person_sessions', new TableIndex({
      name: 'IDX_person_sessions_access_token',
      columnNames: ['accessToken'],
      isUnique: true,
    }));

    await queryRunner.createIndex('person_sessions', new TableIndex({
      name: 'IDX_person_sessions_refresh_token',
      columnNames: ['refreshToken'],
      isUnique: true,
    }));

    await queryRunner.createIndex('person_sessions', new TableIndex({
      name: 'IDX_person_sessions_person_id',
      columnNames: ['personId'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление индексов
    await queryRunner.dropIndex('person_sessions', 'IDX_person_sessions_person_id');
    await queryRunner.dropIndex('person_sessions', 'IDX_person_sessions_refresh_token');
    await queryRunner.dropIndex('person_sessions', 'IDX_person_sessions_access_token');
    
    // Удаление таблиц
    await queryRunner.dropTable('person_states');
    await queryRunner.dropTable('person_sessions');
  }
}