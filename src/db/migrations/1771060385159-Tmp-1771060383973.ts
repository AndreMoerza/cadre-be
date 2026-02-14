import { MigrationInterface, QueryRunner } from "typeorm";

export class Tmp17710603839731771060385159 implements MigrationInterface {
    name = 'Tmp17710603839731771060385159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_858f96abdfdb3e781ec313ee0a"`);
        await queryRunner.query(`CREATE TYPE "public"."product_media_type_enum" AS ENUM('IMAGE', 'VIDEO')`);
        await queryRunner.query(`CREATE TYPE "public"."product_media_role_enum" AS ENUM('THUMBNAIL', 'GALLERY', 'VIDEO')`);
        await queryRunner.query(`CREATE TABLE "product_media" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."product_media_type_enum" NOT NULL DEFAULT 'IMAGE', "role" "public"."product_media_role_enum" NOT NULL DEFAULT 'GALLERY', "order" integer NOT NULL DEFAULT '0', "productId" uuid, "fileId" uuid, CONSTRAINT "PK_09d4639de8082a32aa27f3ac9a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4d6ccada4de87e29229161443c" ON "product_media" ("productId", "order") `);
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "number"`);
        await queryRunner.query(`ALTER TABLE "product_media" ADD CONSTRAINT "FK_50e3945c6150d80b69b5f18515a" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_media" ADD CONSTRAINT "FK_351ac0e2ab6542a3a6a9f6a6ccc" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_media" DROP CONSTRAINT "FK_351ac0e2ab6542a3a6a9f6a6ccc"`);
        await queryRunner.query(`ALTER TABLE "product_media" DROP CONSTRAINT "FK_50e3945c6150d80b69b5f18515a"`);
        await queryRunner.query(`ALTER TABLE "sales" ADD "number" text NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d6ccada4de87e29229161443c"`);
        await queryRunner.query(`DROP TABLE "product_media"`);
        await queryRunner.query(`DROP TYPE "public"."product_media_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."product_media_type_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_858f96abdfdb3e781ec313ee0a" ON "sales" ("number") `);
    }

}
