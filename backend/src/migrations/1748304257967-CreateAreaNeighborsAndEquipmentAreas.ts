import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAreaNeighborsAndEquipmentAreas1748304257967 implements MigrationInterface {
    name = 'CreateAreaNeighborsAndEquipmentAreas1748304257967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_equipment" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "initialOperationsDate" date NOT NULL, "areaId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_63108a7875b1edbd0e3d2a6086b" FOREIGN KEY ("areaId") REFERENCES "area" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_equipment"("id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt") SELECT "id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt" FROM "equipment"`);
        await queryRunner.query(`DROP TABLE "equipment"`);
        await queryRunner.query(`ALTER TABLE "temporary_equipment" RENAME TO "equipment"`);
        await queryRunner.query(`CREATE TABLE "equipment_areas" ("equipmentId" varchar NOT NULL, "areaId" varchar NOT NULL, PRIMARY KEY ("equipmentId", "areaId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_42b9be86a30fb153752433348e" ON "equipment_areas" ("equipmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_27d2868708a859c9cdafcabc07" ON "equipment_areas" ("areaId") `);
        await queryRunner.query(`CREATE TABLE "area_neighbors" ("areaId" varchar NOT NULL, "neighborId" varchar NOT NULL, PRIMARY KEY ("areaId", "neighborId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e2ec01df39a06d4f7ee6b7c376" ON "area_neighbors" ("areaId") `);
        await queryRunner.query(`CREATE INDEX "IDX_58a5c18b564edd076e367f09b3" ON "area_neighbors" ("neighborId") `);
        await queryRunner.query(`CREATE TABLE "temporary_equipment" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "initialOperationsDate" date NOT NULL, "areaId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`INSERT INTO "temporary_equipment"("id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt") SELECT "id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt" FROM "equipment"`);
        await queryRunner.query(`DROP TABLE "equipment"`);
        await queryRunner.query(`ALTER TABLE "temporary_equipment" RENAME TO "equipment"`);
        await queryRunner.query(`CREATE TABLE "temporary_equipment" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "initialOperationsDate" date NOT NULL, "areaId" varchar, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`INSERT INTO "temporary_equipment"("id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt") SELECT "id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt" FROM "equipment"`);
        await queryRunner.query(`DROP TABLE "equipment"`);
        await queryRunner.query(`ALTER TABLE "temporary_equipment" RENAME TO "equipment"`);
        await queryRunner.query(`CREATE TABLE "temporary_equipment" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "initialOperationsDate" date NOT NULL, "areaId" varchar, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_63108a7875b1edbd0e3d2a6086b" FOREIGN KEY ("areaId") REFERENCES "area" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_equipment"("id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt") SELECT "id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt" FROM "equipment"`);
        await queryRunner.query(`DROP TABLE "equipment"`);
        await queryRunner.query(`ALTER TABLE "temporary_equipment" RENAME TO "equipment"`);
        await queryRunner.query(`DROP INDEX "IDX_42b9be86a30fb153752433348e"`);
        await queryRunner.query(`DROP INDEX "IDX_27d2868708a859c9cdafcabc07"`);
        await queryRunner.query(`CREATE TABLE "temporary_equipment_areas" ("equipmentId" varchar NOT NULL, "areaId" varchar NOT NULL, CONSTRAINT "FK_42b9be86a30fb153752433348e1" FOREIGN KEY ("equipmentId") REFERENCES "equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_27d2868708a859c9cdafcabc073" FOREIGN KEY ("areaId") REFERENCES "area" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("equipmentId", "areaId"))`);
        await queryRunner.query(`INSERT INTO "temporary_equipment_areas"("equipmentId", "areaId") SELECT "equipmentId", "areaId" FROM "equipment_areas"`);
        await queryRunner.query(`DROP TABLE "equipment_areas"`);
        await queryRunner.query(`ALTER TABLE "temporary_equipment_areas" RENAME TO "equipment_areas"`);
        await queryRunner.query(`CREATE INDEX "IDX_42b9be86a30fb153752433348e" ON "equipment_areas" ("equipmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_27d2868708a859c9cdafcabc07" ON "equipment_areas" ("areaId") `);
        await queryRunner.query(`DROP INDEX "IDX_e2ec01df39a06d4f7ee6b7c376"`);
        await queryRunner.query(`DROP INDEX "IDX_58a5c18b564edd076e367f09b3"`);
        await queryRunner.query(`CREATE TABLE "temporary_area_neighbors" ("areaId" varchar NOT NULL, "neighborId" varchar NOT NULL, CONSTRAINT "FK_e2ec01df39a06d4f7ee6b7c376d" FOREIGN KEY ("areaId") REFERENCES "area" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_58a5c18b564edd076e367f09b31" FOREIGN KEY ("neighborId") REFERENCES "area" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("areaId", "neighborId"))`);
        await queryRunner.query(`INSERT INTO "temporary_area_neighbors"("areaId", "neighborId") SELECT "areaId", "neighborId" FROM "area_neighbors"`);
        await queryRunner.query(`DROP TABLE "area_neighbors"`);
        await queryRunner.query(`ALTER TABLE "temporary_area_neighbors" RENAME TO "area_neighbors"`);
        await queryRunner.query(`CREATE INDEX "IDX_e2ec01df39a06d4f7ee6b7c376" ON "area_neighbors" ("areaId") `);
        await queryRunner.query(`CREATE INDEX "IDX_58a5c18b564edd076e367f09b3" ON "area_neighbors" ("neighborId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_58a5c18b564edd076e367f09b3"`);
        await queryRunner.query(`DROP INDEX "IDX_e2ec01df39a06d4f7ee6b7c376"`);
        await queryRunner.query(`ALTER TABLE "area_neighbors" RENAME TO "temporary_area_neighbors"`);
        await queryRunner.query(`CREATE TABLE "area_neighbors" ("areaId" varchar NOT NULL, "neighborId" varchar NOT NULL, PRIMARY KEY ("areaId", "neighborId"))`);
        await queryRunner.query(`INSERT INTO "area_neighbors"("areaId", "neighborId") SELECT "areaId", "neighborId" FROM "temporary_area_neighbors"`);
        await queryRunner.query(`DROP TABLE "temporary_area_neighbors"`);
        await queryRunner.query(`CREATE INDEX "IDX_58a5c18b564edd076e367f09b3" ON "area_neighbors" ("neighborId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e2ec01df39a06d4f7ee6b7c376" ON "area_neighbors" ("areaId") `);
        await queryRunner.query(`DROP INDEX "IDX_27d2868708a859c9cdafcabc07"`);
        await queryRunner.query(`DROP INDEX "IDX_42b9be86a30fb153752433348e"`);
        await queryRunner.query(`ALTER TABLE "equipment_areas" RENAME TO "temporary_equipment_areas"`);
        await queryRunner.query(`CREATE TABLE "equipment_areas" ("equipmentId" varchar NOT NULL, "areaId" varchar NOT NULL, PRIMARY KEY ("equipmentId", "areaId"))`);
        await queryRunner.query(`INSERT INTO "equipment_areas"("equipmentId", "areaId") SELECT "equipmentId", "areaId" FROM "temporary_equipment_areas"`);
        await queryRunner.query(`DROP TABLE "temporary_equipment_areas"`);
        await queryRunner.query(`CREATE INDEX "IDX_27d2868708a859c9cdafcabc07" ON "equipment_areas" ("areaId") `);
        await queryRunner.query(`CREATE INDEX "IDX_42b9be86a30fb153752433348e" ON "equipment_areas" ("equipmentId") `);
        await queryRunner.query(`ALTER TABLE "equipment" RENAME TO "temporary_equipment"`);
        await queryRunner.query(`CREATE TABLE "equipment" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "initialOperationsDate" date NOT NULL, "areaId" varchar, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`INSERT INTO "equipment"("id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt") SELECT "id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt" FROM "temporary_equipment"`);
        await queryRunner.query(`DROP TABLE "temporary_equipment"`);
        await queryRunner.query(`ALTER TABLE "equipment" RENAME TO "temporary_equipment"`);
        await queryRunner.query(`CREATE TABLE "equipment" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "initialOperationsDate" date NOT NULL, "areaId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP))`);
        await queryRunner.query(`INSERT INTO "equipment"("id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt") SELECT "id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt" FROM "temporary_equipment"`);
        await queryRunner.query(`DROP TABLE "temporary_equipment"`);
        await queryRunner.query(`ALTER TABLE "equipment" RENAME TO "temporary_equipment"`);
        await queryRunner.query(`CREATE TABLE "equipment" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "initialOperationsDate" date NOT NULL, "areaId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_63108a7875b1edbd0e3d2a6086b" FOREIGN KEY ("areaId") REFERENCES "area" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "equipment"("id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt") SELECT "id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt" FROM "temporary_equipment"`);
        await queryRunner.query(`DROP TABLE "temporary_equipment"`);
        await queryRunner.query(`DROP INDEX "IDX_58a5c18b564edd076e367f09b3"`);
        await queryRunner.query(`DROP INDEX "IDX_e2ec01df39a06d4f7ee6b7c376"`);
        await queryRunner.query(`DROP TABLE "area_neighbors"`);
        await queryRunner.query(`DROP INDEX "IDX_27d2868708a859c9cdafcabc07"`);
        await queryRunner.query(`DROP INDEX "IDX_42b9be86a30fb153752433348e"`);
        await queryRunner.query(`DROP TABLE "equipment_areas"`);
        await queryRunner.query(`ALTER TABLE "equipment" RENAME TO "temporary_equipment"`);
        await queryRunner.query(`CREATE TABLE "equipment" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "manufacturer" varchar NOT NULL, "serialNumber" varchar NOT NULL, "initialOperationsDate" date NOT NULL, "areaId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_63108a7875b1edbd0e3d2a6086b" FOREIGN KEY ("areaId") REFERENCES "area" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "equipment"("id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt") SELECT "id", "name", "manufacturer", "serialNumber", "initialOperationsDate", "areaId", "createdAt", "updatedAt" FROM "temporary_equipment"`);
        await queryRunner.query(`DROP TABLE "temporary_equipment"`);
    }

}
