import { QueryFailedError, Repository } from "typeorm";
import { Equipment } from "../models/Equipment";
import { DatabaseContext } from "../config/database-context";
import { EquipmentNotFoundError } from "../errors/EquipmentNotFoundError";
import { InvalidDataError } from "../errors/InvalidDataError";
import { AreaService } from "./AreaService";
import { CreateEquipmentDTO, UpdateEquipmentDTO } from "../dtos/EquipmentDTO";
import { DependencyExistsError } from "../errors/DependencyExistsError";

export class EquipmentService {
  private equipmentRepository: Repository<Equipment>;
  private areaService = new AreaService();

  constructor() {
    this.equipmentRepository = DatabaseContext
      .getInstance()
      .getRepository(Equipment);
  }

  public async findAll(): Promise<Equipment[]> {
    return this.equipmentRepository
      .createQueryBuilder("equipment")
      .leftJoinAndSelect("equipment.areas", "areas")
      .leftJoinAndSelect("equipment.parts", "parts")
      .getMany();
  }

  public async findById(id: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository
      .createQueryBuilder("equipment")
      .leftJoinAndSelect("equipment.areas", "areas")
      .leftJoinAndSelect("equipment.parts", "parts")
      .where("equipment.id = :id", { id })
      .getOne();

    if (!equipment) throw new EquipmentNotFoundError();
    return equipment;
  }

  public async create(data: CreateEquipmentDTO): Promise<Equipment> {
    const opDate = new Date(data.initialOperationsDate);

    const areaIds = data.areas ?? [];
    if (areaIds.length === 0) {
      throw new InvalidDataError("At least one area must be provided");
    }

    const areas = await Promise.all(
      areaIds.map((aid) => this.areaService.findById(aid))
    );

    for (let i = 0; i < areas.length; i++) {
      for (let j = i + 1; j < areas.length; j++) {
        const neighborIds = (await this.areaService.getNeighbors(areas[i].id))
          .map((a) => a.id);
        if (!neighborIds.includes(areas[j].id)) {
          throw new InvalidDataError(
            `Areas ${areas[i].id} and ${areas[j].id} are not neighbors`
          );
        }
      }
    }

    const equipment = this.equipmentRepository.create();
    equipment.name = data.name;
    equipment.manufacturer = data.manufacturer;
    equipment.serialNumber = data.serialNumber;
    equipment.initialOperationsDate = opDate;
    equipment.areas = areas;

    const saved = await this.equipmentRepository.save(equipment);
    return this.findById(saved.id);
  }

  public async update(
    id: string,
    data: UpdateEquipmentDTO
  ): Promise<Equipment> {
    const equipment = await this.findById(id);

    if (data.name !== undefined) equipment.name = data.name;
    if (data.manufacturer !== undefined) equipment.manufacturer = data.manufacturer;
    if (data.serialNumber !== undefined) equipment.serialNumber = data.serialNumber;
    if (data.initialOperationsDate) {
      equipment.initialOperationsDate = new Date(data.initialOperationsDate);
    }

    if (data.areas) {
      const areaEntities = await Promise.all(
        data.areas.map((aid) => this.areaService.findById(aid))
      );
      for (let i = 0; i < areaEntities.length; i++) {
        for (let j = i + 1; j < areaEntities.length; j++) {
          const neighborIds = (await this.areaService.getNeighbors(
            areaEntities[i].id
          )).map((a) => a.id);
          if (!neighborIds.includes(areaEntities[j].id)) {
            throw new InvalidDataError(
              `Areas ${areaEntities[i].id} and ${areaEntities[j].id} are not neighbors`
            );
          }
        }
      }
      equipment.areas = areaEntities;
    }

    const saved = await this.equipmentRepository.save(equipment);
    return this.findById(saved.id);
  }

  async delete(id: string): Promise<void> {
    const equipment = await this.equipmentRepository.findOneBy({ id });
    if (!equipment) {
      throw new EquipmentNotFoundError(id);
    }

    try {
      await this.equipmentRepository.remove(equipment);
    } catch (err) {
      // Turn any FK‐constraint failure into our DependencyExistsError
      if (err instanceof QueryFailedError) {
        throw new DependencyExistsError(`Cannot delete equipment ${id} because it’s still referenced`);
      }
      throw err;
    }
  }
}
