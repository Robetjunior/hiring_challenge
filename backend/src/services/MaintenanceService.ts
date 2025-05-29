import { Repository, MoreThanOrEqual } from "typeorm";
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
      order: { dueDate: "ASC" },
    });
  }

  public async findUpcoming(): Promise<Maintenance[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.repo.find({
      where: { dueDate: MoreThanOrEqual(today) },
      relations: ["part", "equipment", "area", "plant"],
      order: { dueDate: "ASC" },
    });
  }

  public async findById(id: string): Promise<Maintenance> {
    const maint = await this.repo.findOne({
      where: { id },
      relations: ["part", "equipment", "area", "plant"],
    });
    if (!maint) throw new NotFoundError("Maintenance não encontrada");
    return maint;
  }

  public async create(dto: CreateMaintenanceDTO): Promise<Maintenance> {
    await Promise.all([
      this.partService.findById(dto.partId),
      this.equipmentService.findById(dto.equipmentId),
      this.areaService.findById(dto.areaId),
      this.plantService.findById(dto.plantId),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dto.dueDate && new Date(dto.dueDate) < today) {
      throw new InvalidDataError("Data Limite não pode ser anterior a hoje");
    }
    if (dto.fixedDate && new Date(dto.fixedDate) < today) {
      throw new InvalidDataError("Data Fixa não pode ser anterior a hoje");
    }

    // determine initial dueDate
    let dueDate: Date | null =
      dto.fixedDate
        ? new Date(dto.fixedDate)
        : dto.dueDate
        ? new Date(dto.dueDate)
        : null;

    if (dto.intervalMonths != null) {
      // recurring schedule
      let baseDate: Date;
      if (dto.fixedDate) {
        baseDate = new Date(dto.fixedDate);
      } else if (dto.baseType === "equipment") {
        baseDate = (
          await this.equipmentService.findById(dto.equipmentId)
        ).initialOperationsDate;
      } else {
        baseDate = (
          await this.partService.findById(dto.partId)
        ).installationDate;
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
    // 1) fetch the existing record
    const existing = await this.repo.findOneBy({ id });
    if (!existing) throw new NotFoundError("Maintenance não encontrada");

    // 2) validate any FK swaps
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

    // 3) block any dates before today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dto.fixedDate && new Date(dto.fixedDate) < today) {
      throw new InvalidDataError("Data Fixa não pode ser anterior a hoje");
    }
    if (dto.dueDate && new Date(dto.dueDate) < today) {
      throw new InvalidDataError("Data Limite não pode ser anterior a hoje");
    }

    // 4) collect simple updates
    const updates: Partial<Maintenance> = {};
    if (dto.title           !== undefined) updates.title          = dto.title;
    if (dto.fixedDate       !== undefined) updates.fixedDate     = new Date(dto.fixedDate);
    if (dto.intervalMonths  !== undefined) updates.intervalMonths= dto.intervalMonths;
    if (dto.baseType        !== undefined) updates.baseType       = dto.baseType;
    if (dto.partId          !== undefined) updates.partId         = dto.partId;
    if (dto.equipmentId     !== undefined) updates.equipmentId    = dto.equipmentId;
    if (dto.areaId          !== undefined) updates.areaId         = dto.areaId;
    if (dto.plantId         !== undefined) updates.plantId        = dto.plantId;

    // 5) always recalc dueDate = fixedDate + intervalMonths when both exist (new or existing)
    const base = updates.fixedDate ?? existing.fixedDate;
    const months = (dto.intervalMonths ?? existing.intervalMonths);
    if (base && months != null) {
      const next = new Date(base);
      next.setMonth(next.getMonth() + months);
      updates.dueDate = next;
    }
    // 6) fallback: if user explicitly sent a one-off dueDate, use it
    else if (dto.dueDate) {
      updates.dueDate = new Date(dto.dueDate);
    }

    // 7) persist and return the hydrated entity
    await this.repo.update(id, updates);
    return this.findById(id);
  }

  public async delete(id: string): Promise<void> {
    // minimal lookup avoids full relations
    const maint = await this.repo.findOneBy({ id });
    if (!maint) throw new NotFoundError("Maintenance não encontrada");
    await this.repo.remove(maint);
  }
}
