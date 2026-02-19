import { MigrationInterface, QueryRunner } from "typeorm";

export class Tmp17714821888211771482189732 implements MigrationInterface {
    name = 'Tmp17714821888211771482189732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands" ADD "imageId" uuid`);
        await queryRunner.query(`ALTER TABLE "brands" ADD CONSTRAINT "FK_f47df7ed65fc1337d71a7b590da" FOREIGN KEY ("imageId") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "FK_f47df7ed65fc1337d71a7b590da"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "imageId"`);
    }

}
