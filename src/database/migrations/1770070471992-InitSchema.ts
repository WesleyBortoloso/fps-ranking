import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1770070471992 implements MigrationInterface {
    name = 'InitSchema1770070471992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "matches" ("id" SERIAL NOT NULL, "externalId" integer NOT NULL, "startedAt" TIMESTAMP NOT NULL, "endedAt" TIMESTAMP, CONSTRAINT "UQ_230d214d26becc5c13cc553e428" UNIQUE ("externalId"), CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "matches"`);
    }

}
