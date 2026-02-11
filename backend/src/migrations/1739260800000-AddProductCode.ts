import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductCode1739260800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create the sequence for auto-increment
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "products_productCode_seq" AS integer`,
    );

    // 2. Add the productCode column with sequence default
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "productCode" integer DEFAULT nextval('"products_productCode_seq"')`,
    );

    // 3. Assign incremental values to any existing products that have NULL productCode
    await queryRunner.query(`
      WITH numbered AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt" ASC) AS rn
        FROM "products"
        WHERE "productCode" IS NULL
      )
      UPDATE "products"
      SET "productCode" = numbered.rn
      FROM numbered
      WHERE "products".id = numbered.id
    `);

    // 4. Advance the sequence past the highest assigned value
    await queryRunner.query(`
      SELECT setval('"products_productCode_seq"', COALESCE(
        (SELECT MAX("productCode") FROM "products"), 0
      ))
    `);

    // 5. Set column to NOT NULL now that all rows have values
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "productCode" SET NOT NULL`,
    );

    // 6. Add unique constraint
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "UQ_products_productCode" UNIQUE ("productCode")`,
    );

    // 7. Set sequence ownership so it drops with the column
    await queryRunner.query(
      `ALTER SEQUENCE "products_productCode_seq" OWNED BY "products"."productCode"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "UQ_products_productCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN IF EXISTS "productCode"`,
    );
    await queryRunner.query(
      `DROP SEQUENCE IF EXISTS "products_productCode_seq"`,
    );
  }
}
