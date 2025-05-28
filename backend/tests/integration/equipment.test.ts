import request from 'supertest';
import { app } from '../../src/app';
import { Equipment } from '../../src/models/Equipment';
import { Area } from '../../src/models/Area';
import { Plant } from '../../src/models/Plant';
import { DatabaseContext } from '../../src/config/database-context';
import { Repository } from 'typeorm';
import { beforeEach, describe, it, expect } from '@jest/globals';

describe('Equipment Controller Integration Tests', () => {
  let equipmentRepository: Repository<Equipment>;
  let areaRepository: Repository<Area>;
  let plantRepository: Repository<Plant>;
  let testArea: Area;
  let testPlant: Plant;

  beforeEach(async () => {
    equipmentRepository = DatabaseContext.getInstance().getRepository(Equipment);
    areaRepository = DatabaseContext.getInstance().getRepository(Area);
    plantRepository = DatabaseContext.getInstance().getRepository(Plant);

    await equipmentRepository.clear();
    await areaRepository.clear();
    await plantRepository.clear();

    testPlant = await plantRepository.save(
      plantRepository.create({ name: 'Test Plant', address: 'Test Address' })
    );

    testArea = await areaRepository.save(
      areaRepository.create({
        name: 'Test Area',
        locationDescription: 'Test Location',
        plantId: testPlant.id
      })
    );
  });

  describe('POST /equipment', () => {
    it('should create new equipment with valid data', async () => {
      const initialDate = new Date('2024-01-01');
      const newEquipment = {
        name: 'New Equipment',
        manufacturer: 'New Manufacturer',
        serialNumber: 'NEW001',
        initialOperationsDate: initialDate.toISOString(),
        areas: [testArea.id]
      };

      const response = await request(app)
        .post('/equipment')
        .send(newEquipment)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          name: newEquipment.name,
          manufacturer: newEquipment.manufacturer,
          serialNumber: newEquipment.serialNumber,
          areas: expect.arrayContaining([
            expect.objectContaining({ id: testArea.id })
          ])
        })
      );

      const saved = await equipmentRepository.findOne({ where: { id: response.body.id } });
      expect(saved).toBeTruthy();
      expect(saved?.name).toBe(newEquipment.name);
    });
  });
});
