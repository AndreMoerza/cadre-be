import { MigrationInterface, QueryRunner } from "typeorm";

export class Tmp17710490006741771049001629 implements MigrationInterface {
    name = 'Tmp17710490006741771049001629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "brands" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" text NOT NULL, "name" text NOT NULL, "email" text, "phone" text, CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1687d82f42d8b3f8162a29e7df" ON "brands" ("code") `);
        await queryRunner.query(`CREATE TABLE "products" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "price" numeric(14,2) NOT NULL DEFAULT '0', "salePrice" numeric(14,2) NOT NULL DEFAULT '0', "displayStock" numeric NOT NULL DEFAULT '0', "realStock" numeric NOT NULL DEFAULT '0', "description" text, "status" "public"."products_status_enum" NOT NULL DEFAULT 'ACTIVE', "brandId" uuid, "categoryId" uuid NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_items" ADD CONSTRAINT "FK_d675aea38a16313e844662c48f8" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_items" DROP CONSTRAINT "FK_d675aea38a16313e844662c48f8"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1687d82f42d8b3f8162a29e7df"`);
        await queryRunner.query(`DROP TABLE "brands"`);
    }

}
