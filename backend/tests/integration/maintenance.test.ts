import request from 'supertest';
import { app } from '../../src/app';
import { Repository } from 'typeorm';
import { DatabaseContext } from '../../src/config/database-context';
import { Plant } from '../../src/models/Plant';
import { Area } from '../../src/models/Area';
import { Equipment } from '../../src/models/Equipment';
import { Part, PartType } from '../../src/models/Part';
import { Maintenance } from '../../src/models/Maintenance';
import { beforeEach, describe, it, expect } from '@jest/globals';

describe('Maintenance Controller Integration Tests', () => {
  let plantRepo: Repository<Plant>;
  let areaRepo: Repository<Area>;
  let equipmentRepo: Repository<Equipment>;
  let partRepo: Repository<Part>;
  let maintenanceRepo: Repository<Maintenance>;

  let testPlant: Plant;
  let testArea: Area;
  let testEquipment: Equipment;
  let testPart: Part;

  beforeEach(async () => {
    const ctx = DatabaseContext.getInstance();
    plantRepo = ctx.getRepository(Plant);
    areaRepo = ctx.getRepository(Area);
    equipmentRepo = ctx.getRepository(Equipment);
    partRepo = ctx.getRepository(Part);
    maintenanceRepo = ctx.getRepository(Maintenance);

    await maintenanceRepo.clear();
    await partRepo.clear();
    await equipmentRepo.clear();
    await areaRepo.clear();
    await plantRepo.clear();

    testPlant = await plantRepo.save(
      plantRepo.create({ name: 'Plant', address: 'Addr' })
    );
    testArea = await areaRepo.save(
      areaRepo.create({
        name: 'Area',
        locationDescription: 'Loc',
        plantId: testPlant.id,
      })
    );
    testEquipment = await equipmentRepo.save(
      equipmentRepo.create({
        name: 'Equip',
        manufacturer: 'Mfr',
        serialNumber: 'SN123',
        initialOperationsDate: new Date(),
        areaId: testArea.id,
        areas: [], // legacy
      })
    );
    testPart = await partRepo.save(
      partRepo.create({
        name: 'Part',
        type: PartType.ELECTRIC,
        manufacturer: 'Mfr',
        serialNumber: 'PSN',
        installationDate: new Date(),
        equipmentId: testEquipment.id,
      })
    );
  });

  describe('POST /maintenance', () => {
    it('creates a new maintenance with intervalMonths', async () => {
      const payload = {
        title: 'Check Filter',
        baseType: 'piece',
        intervalMonths: 3,
        partId: testPart.id,
        equipmentId: testEquipment.id,
        areaId: testArea.id,
        plantId: testPlant.id,
      };
      const res = await request(app).post('/maintenance').send(payload).expect(200);
      expect(res.body).toMatchObject({
        title: payload.title,
        partId: payload.partId,
        equipmentId: payload.equipmentId,
        areaId: payload.areaId,
        plantId: payload.plantId,
      });
      const m = await maintenanceRepo.findOneBy({ id: res.body.id });
      expect(m).toBeTruthy();
      expect(m!.intervalMonths).toBe(3);
    });

    it('rejects when dueDate is in the past', async () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const payload = {
        title: 'Past Due',
        dueDate: past.toISOString(),
        partId: testPart.id,
        equipmentId: testEquipment.id,
        areaId: testArea.id,
        plantId: testPlant.id,
      };
      await request(app).post('/maintenance').send(payload).expect(400);
    });
  });

  describe('GET /maintenance/upcoming', () => {
    it('returns only future maintenance', async () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const future = new Date();
      future.setDate(future.getDate() + 1);
      await maintenanceRepo.save(
        maintenanceRepo.create({
          title: 'Old',
          dueDate: past,
          partId: testPart.id,
          equipmentId: testEquipment.id,
          areaId: testArea.id,
          plantId: testPlant.id,
        })
      );
      await maintenanceRepo.save(
        maintenanceRepo.create({
          title: 'New',
          dueDate: future,
          partId: testPart.id,
          equipmentId: testEquipment.id,
          areaId: testArea.id,
          plantId: testPlant.id,
        })
      );

      const res = await request(app).get('/maintenance/upcoming').expect(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('New');
    });
  });

  describe('GET /maintenance/:id', () => {
    it('returns 404 for non-existent', async () => {
      await request(app).get('/maintenance/does-not-exist').expect(404);
    });
  });

  describe('DELETE /maintenance/:id', () => {
    it('deletes existing maintenance', async () => {
      const m = await maintenanceRepo.save(
        maintenanceRepo.create({
          title: 'To Delete',
          dueDate: new Date(),
          partId: testPart.id,
          equipmentId: testEquipment.id,
          areaId: testArea.id,
          plantId: testPlant.id,
        })
      );
      await request(app).delete(`/maintenance/${m.id}`).expect(204);
      expect(await maintenanceRepo.findOneBy({ id: m.id })).toBeNull();
    });
  });
});
