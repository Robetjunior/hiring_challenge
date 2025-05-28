import { MoreThanOrEqual, Repository } from "typeorm";
import { Maintenance } from "../models/Maintenance";
import { DatabaseContext } from "../config/database-context";
import { CreateMaintenanceDTO, UpdateMaintenanceDTO } from "../dtos/MaintenanceDTO";
import { PartService } from "./PartService";
import { EquipmentService } from "./EquipmentService";
import { AreaService } from "./AreaService";
import { PlantService } from "./PlantService";
import { NotFoundError } from "../errors/NotFoundError";
import { InvalidDataError } from "../errors/InvalidDataError";

export class MaintenanceService {
  private repo: Repository<Maintenance>;
  private partService = new PartService();
  private equipmentService = new EquipmentService();
  private areaService = new AreaService();
  private plantService = new PlantService();

  constructor() {
    this.repo = DatabaseContext.getInstance().getRepository(Maintenance);
  }

  public async findAll(): Promise<Maintenance[]> {
    return this.repo.find({
      relations: ["part", "equipment", "area", "plant"],
      order: { dueDate: "ASC" }
    });
  }

  public async findUpcoming(): Promise<Maintenance[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.repo.find({
      where: { dueDate: MoreThanOrEqual(today) },
      relations: ["part", "equipment", "area", "plant"],
      order: { dueDate: "ASC" }
    });
  }

  public async findById(id: string): Promise<Maintenance> {
    const maint = await this.repo.findOne({
      where: { id },
      relations: ["part", "equipment", "area", "plant"]
    });
    if (!maint) throw new NotFoundError("Maintenance não encontrada");
    return maint;
  }

  public async create(dto: CreateMaintenanceDTO): Promise<Maintenance> {
    // valida relações
    await Promise.all([
      this.partService.findById(dto.partId),
      this.equipmentService.findById(dto.equipmentId),
      this.areaService.findById(dto.areaId),
      this.plantService.findById(dto.plantId),
    ]);

    // valida datas não passadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dto.dueDate && new Date(dto.dueDate) < today) {
      throw new InvalidDataError("Data Limite não pode ser anterior a hoje");
    }
    if (dto.fixedDate && new Date(dto.fixedDate) < today) {
      throw new InvalidDataError("Data Fixa não pode ser anterior a hoje");
    }

    // determina dueDate
    let dueDate: Date | null =
      dto.fixedDate ? new Date(dto.fixedDate)
        : dto.dueDate        ? new Date(dto.dueDate)
        : null;

    if (dto.intervalMonths != null) {
      let baseDate: Date;
      if (dto.fixedDate) {
        baseDate = new Date(dto.fixedDate);
      } else if (dto.baseType === "equipment") {
        baseDate = (await this.equipmentService.findById(dto.equipmentId))
          .initialOperationsDate;
      } else {
        // default ou dto.baseType==="piece"
        baseDate = (await this.partService.findById(dto.partId))
          .installationDate;
      }
      dueDate = new Date(baseDate);
      dueDate.setMonth(dueDate.getMonth() + dto.intervalMonths);
    }

    if (!dueDate) {
      throw new InvalidDataError(
        "É necessário fixedDate, dueDate ou intervalMonths"
      );
    }

    const m = this.repo.create({ ...dto, dueDate });
    const saved = await this.repo.save(m);
    return this.findById(saved.id);
  }

  public async update(id: string, dto: UpdateMaintenanceDTO): Promise<Maintenance> {
      const existing = await this.repo.findOneBy({ id });
      if (!existing) throw new NotFoundError("Maintenance não encontrada");

      // valida relações trocadas
      if (dto.partId && dto.partId !== existing.partId) {
        await this.partService.findById(dto.partId);
      }
      if (dto.equipmentId && dto.equipmentId !== existing.equipmentId) {
        await this.equipmentService.findById(dto.equipmentId);
      }
      if (dto.areaId && dto.areaId !== existing.areaId) {
        await this.areaService.findById(dto.areaId);
      }
      if (dto.plantId && dto.plantId !== existing.plantId) {
        await this.plantService.findById(dto.plantId);
      }

      // valida datas passadas
      const today = new Date(); today.setHours(0,0,0,0);
      if (dto.dueDate && new Date(dto.dueDate) < today) {
        throw new InvalidDataError("Data Limite não pode ser anterior a hoje");
      }
      if (dto.fixedDate && new Date(dto.fixedDate) < today) {
        throw new InvalidDataError("Data Fixa não pode ser anterior a hoje");
      }

      // constrói o objeto de updates, convertendo strings em Dates
      const updates: Partial<Maintenance> = {};
      if (dto.title        !== undefined) updates.title         = dto.title;
      if (dto.fixedDate    !== undefined) updates.fixedDate     = new Date(dto.fixedDate);
      if (dto.intervalMonths !== undefined) updates.intervalMonths = dto.intervalMonths;
      if (dto.dueDate      !== undefined) updates.dueDate       = new Date(dto.dueDate);
      if (dto.partId       !== undefined) updates.partId        = dto.partId;
      if (dto.equipmentId  !== undefined) updates.equipmentId   = dto.equipmentId;
      if (dto.areaId       !== undefined) updates.areaId        = dto.areaId;
      if (dto.plantId      !== undefined) updates.plantId       = dto.plantId;

      // **Aqui**: persista o baseType
      if (dto.baseType     !== undefined) updates.baseType      = dto.baseType;

      // recálculo de dueDate se fixedDate ou intervalo mudaram sem dueDate manual
      if ((dto.fixedDate !== undefined || dto.intervalMonths !== undefined) &&
          dto.dueDate === undefined) {
        let baseDate: Date;
        if (updates.fixedDate) {
          baseDate = updates.fixedDate;
        } else if (dto.baseType === "equipment") {
          baseDate = (await this.equipmentService.findById(existing.equipmentId))
                      .initialOperationsDate;
        } else {
          baseDate = existing.fixedDate
                    ?? (await this.partService.findById(existing.partId)).installationDate;
        }
        const next = new Date(baseDate);
        next.setMonth(
          next.getMonth() + (dto.intervalMonths ?? existing.intervalMonths ?? 0)
        );
        updates.dueDate = next;
      }

      await this.repo.update(id, updates);
      return this.findById(id);
    }


  public async delete(id: string): Promise<void> {
    const maint = await this.findById(id);
    await this.repo.remove(maint);
  }
}
