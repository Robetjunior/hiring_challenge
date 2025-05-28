import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBaseTypeToMaintenance1748470990672 implements MigrationInterface {
    name = 'AddBaseTypeToMaintenance1748470990672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_maintenance" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "dueDate" date NOT NULL, "intervalMonths" integer, "fixedDate" date, "partId" varchar NOT NULL, "equipmentId" varchar NOT NULL, "areaId" varchar NOT NULL, "plantId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "baseType" varchar(16) NOT NULL DEFAULT ('piece'), CONSTRAINT "FK_3d005b0b7eb93b5088ef6b87eb6" FOREIGN KEY ("plantId") REFERENCES "plant" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_46e1a9583eaad176762e60dc7c7" FOREIGN KEY ("areaId") REFERENCES "area" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c3b5144512b830584632ee0bc44" FOREIGN KEY ("equipmentId") REFERENCES "equipment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_291768284faf7096d418c7113b2" FOREIGN KEY ("partId") REFERENCES "part" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_maintenance"("id", "title", "dueDate", "intervalMonths", "fixedDate", "partId", "equipmentId", "areaId", "plantId", "createdAt", "updatedAt") SELECT "id", "title", "dueDate", "intervalMonths", "fixedDate", "partId", "equipmentId", "areaId", "plantId", "createdAt", "updatedAt" FROM "maintenance"`);
        await queryRunner.query(`DROP TABLE "maintenance"`);
        await queryRunner.query(`ALTER TABLE "temporary_maintenance" RENAME TO "maintenance"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "maintenance" RENAME TO "temporary_maintenance"`);
        await queryRunner.query(`CREATE TABLE "maintenance" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "dueDate" date NOT NULL, "intervalMonths" integer, "fixedDate" date, "partId" varchar NOT NULL, "equipmentId" varchar NOT NULL, "areaId" varchar NOT NULL, "plantId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_3d005b0b7eb93b5088ef6b87eb6" FOREIGN KEY ("plantId") REFERENCES "plant" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_46e1a9583eaad176762e60dc7c7" FOREIGN KEY ("areaId") REFERENCES "area" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c3b5144512b830584632ee0bc44" FOREIGN KEY ("equipmentId") REFERENCES "equipment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_291768284faf7096d418c7113b2" FOREIGN KEY ("partId") REFERENCES "part" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "maintenance"("id", "title", "dueDate", "intervalMonths", "fixedDate", "partId", "equipmentId", "areaId", "plantId", "createdAt", "updatedAt") SELECT "id", "title", "dueDate", "intervalMonths", "fixedDate", "partId", "equipmentId", "areaId", "plantId", "createdAt", "updatedAt" FROM "temporary_maintenance"`);
        await queryRunner.query(`DROP TABLE "temporary_maintenance"`);
    }

}
