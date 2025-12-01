  import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenColumns1712345678901 implements MigrationInterface {
    name = 'AddRefreshTokenColumns1712345678901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "persons" 
            ADD COLUMN "refreshToken" TEXT,
            ADD COLUMN "refreshTokenExpires" TIMESTAMP
        `);
    }А

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "persons" 
            DROP COLUMN "refreshToken",
            DROP COLUMN "refreshTokenExpires"
        `);
    }
}