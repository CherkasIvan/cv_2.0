import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenToPersons1764262804682
    implements MigrationInterface
{
    name = 'AddRefreshTokenToPersons1764262804682';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "persons" 
            ADD COLUMN "refreshToken" text NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "persons" 
            DROP COLUMN "refreshToken"
        `);
    }
}
