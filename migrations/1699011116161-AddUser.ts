import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUser1699011116161 implements MigrationInterface {
    name = 'AddUser1699011116161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(50), "name" character varying(100) NOT NULL, "lastname" character varying(100), "username" character varying(50) NOT NULL, "passwordHash" character varying NOT NULL, "roles" text NOT NULL, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "statusId" integer, CONSTRAINT "username" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_statuses" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_50cc8fb0f4810b2f3bfcef7a788" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_fffa7945e50138103659f6326b7" FOREIGN KEY ("statusId") REFERENCES "user_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_fffa7945e50138103659f6326b7"`);
        await queryRunner.query(`DROP TABLE "user_statuses"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
