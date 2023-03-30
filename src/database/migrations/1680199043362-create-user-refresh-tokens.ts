import { MigrationInterface, QueryRunner } from "typeorm";

export class createUserRefreshTokens1680199043362 implements MigrationInterface {
    name = 'createUserRefreshTokens1680199043362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "refresh_token" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_d9375f004983dfbd113aba713dd" UNIQUE ("refresh_token"), CONSTRAINT "PK_c5f5cf35bd8aabd1ebe9bb13409" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_refresh_tokens" ADD CONSTRAINT "FK_15ffbf3cf712c581611caf2130a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_refresh_tokens" DROP CONSTRAINT "FK_15ffbf3cf712c581611caf2130a"`);
        await queryRunner.query(`DROP TABLE "user_refresh_tokens"`);
    }

}
