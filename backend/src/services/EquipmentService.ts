// src/services/EquipmentService.ts
import { Equipment } from "../models/Equipment";
import { DatabaseContext } from "../config/database-context";
import { Repository } from "typeorm";
import { EquipmentNotFoundError } from "../errors/EquipmentNotFoundError";
import { InvalidDataError } from "../errors/InvalidDataError";
import { AreaService } from "./AreaService";

export class EquipmentService {
  private equipmentRepository: Repository<Equipment>;
  private areaService = new AreaService();

  constructor() {
    this.equipmentRepository = DatabaseContext.getInstance().getRepository(Equipment);
  }

  public async findAll(): Promise<Equipment[]> {
    return this.equipmentRepository
      .createQueryBuilder('equipment')
      .leftJoinAndSelect('equipment.areas', 'areas')
      .leftJoinAndSelect('equipment.parts', 'parts')
      .getMany();
  }

  public async findById(id: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository
      .createQueryBuilder('equipment')
      .leftJoinAndSelect('equipment.areas', 'areas')
      .leftJoinAndSelect('equipment.parts', 'parts')
      .where('equipment.id = :id', { id })
      .getOne();
    if (!equipment) throw new EquipmentNotFoundError();
    return equipment;
  }

  public async create(
    data: Omit<Equipment, "id" | "createdAt" | "updatedAt"> & { areas?: string[] }
  ): Promise<Equipment> {
    const areaIds = data.areas ?? [data.areaId];
    const areas = await Promise.all(
      areaIds.map(id => this.areaService.findById(id))
    );
    // Validate neighbor relationships
    for (let i = 0; i < areas.length; i++) {
      for (let j = i + 1; j < areas.length; j++) {
        const neighborIds = (await this.areaService.getNeighbors(areas[i].id)).map(a => a.id);
        if (!neighborIds.includes(areas[j].id)) {
          throw new InvalidDataError(`Areas ${areas[i].id} and ${areas[j].id} are not neighbors`);
        }
      }
    }
    const equipment = this.equipmentRepository.create();
    Object.assign(equipment, data);
    equipment.areas = areas;

    const saved = await this.equipmentRepository.save(equipment);
    return this.findById(saved.id);
  }

  public async update(
    id: string,
    data: Partial<Omit<Equipment, "id" | "createdAt" | "updatedAt" | "areas">> & { areas?: string[] }
  ): Promise<Equipment> {
    const eq = await this.findById(id);
    const { areas, ...rest } = data;
    if (areas) {
      const areaEntities = await Promise.all(
        areas.map(aid => this.areaService.findById(aid))
      );
      for (let i = 0; i < areaEntities.length; i++) {
        for (let j = i + 1; j < areaEntities.length; j++) {
          const neighborIds = (await this.areaService.getNeighbors(areaEntities[i].id)).map(a => a.id);
          if (!neighborIds.includes(areaEntities[j].id)) {
            throw new InvalidDataError(`Areas ${areaEntities[i].id} and ${areaEntities[j].id} are not neighbors`);
          }
        }
      }
      eq.areas = areaEntities;
    }
    Object.assign(eq, rest);
    const saved = await this.equipmentRepository.save(eq);
    return this.findById(saved.id);
  }

  public async delete(id: string): Promise<void> {
    const eq = await this.equipmentRepository.findOneBy({ id });
    if (!eq) throw new EquipmentNotFoundError();
    await this.equipmentRepository.remove(eq);
  }
}
