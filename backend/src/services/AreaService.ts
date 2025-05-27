import { Area } from "../models/Area";
import { DatabaseContext } from "../config/database-context";
import { Repository, QueryFailedError } from "typeorm";
import { AreaNotFoundError } from "../errors/AreaNotFoundError";
import { InvalidForeignKeyError } from "../errors/InvalidForeignKeyError";
import { InvalidDataError } from "../errors/InvalidDataError";
import { DependencyExistsError } from "../errors/DependencyExistsError";

export class AreaService {
    private areaRepository: Repository<Area>;

    constructor() {
        this.areaRepository = DatabaseContext.getInstance().getRepository(Area);
    }

    public async findAll(): Promise<Area[]> {
        return this.areaRepository
        .createQueryBuilder('area')
        .leftJoinAndSelect('area.plant', 'plant')
        .leftJoinAndSelect('area.neighbors', 'neighbors')
        .leftJoinAndSelect('area.equipment', 'equipment')
        .getMany();
    }

    public async findById(id: string): Promise<Area> {
        const area = await this.areaRepository
        .createQueryBuilder('area')
        .leftJoinAndSelect('area.neighbors', 'neighbors')
        .where('area.id = :id', { id })
        .getOne();
        if (!area) throw new AreaNotFoundError();
        return area;
    }

    public async getNeighbors(id: string): Promise<Area[]> {
        const area = await this.findById(id);
        return area.neighbors || [];
    }

    async addNeighbor(areaId: string, neighborId: string): Promise<void> {
        if (areaId === neighborId) throw new InvalidDataError("An area cannot be its own neighbor");
        const area = await this.findById(areaId);
        const neighbor = await this.findById(neighborId);

        if (!area.neighbors) area.neighbors = [];
        if (!neighbor.neighbors) neighbor.neighbors = [];

        if (!area.neighbors.some(n => n.id === neighborId)) {
            area.neighbors.push(neighbor);
            await this.areaRepository.save(area);
        }
        if (!neighbor.neighbors.some(n => n.id === areaId)) {
            neighbor.neighbors.push(area);
            await this.areaRepository.save(neighbor);
        }
    }

    async removeNeighbor(areaId: string, neighborId: string): Promise<void> {
        const area = await this.findById(areaId);
        const neighbor = await this.findById(neighborId);

        area.neighbors = (area.neighbors || []).filter(n => n.id !== neighborId);
        neighbor.neighbors = (neighbor.neighbors || []).filter(n => n.id !== areaId);
        await this.areaRepository.save(area);
        await this.areaRepository.save(neighbor);
    }

    public async create(data: Pick<Area, 'name' | 'locationDescription' | 'plantId'>): Promise<Area> {
        try {
        const area = this.areaRepository.create(data);
        const saved = await this.areaRepository.save(area);
        return this.findById(saved.id);
        } catch (error: any) {
        if (error.message.includes('FOREIGN KEY')) {
            throw new InvalidForeignKeyError('Invalid plant ID');
        }
        throw new InvalidDataError('Invalid area data');
        }
    }

    public async update(id: string, data: Partial<Pick<Area, 'name' | 'locationDescription'>>): Promise<Area> {
        const area = await this.findById(id);
        Object.assign(area, data);
        try {
        await this.areaRepository.save(area);
        return this.findById(id);
        } catch (error) {
        throw new InvalidDataError('Invalid area data');
        }
    }

    public async delete(id: string): Promise<void> {
        const area = await this.findById(id);
        if (area.equipment && area.equipment.length > 0) {
        throw new DependencyExistsError('Cannot delete area with associated equipment');
        }
        await this.areaRepository.remove(area);
    }
}
