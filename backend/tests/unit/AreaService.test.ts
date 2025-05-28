import { AreaService } from "../../src/services/AreaService";
import { DatabaseContext } from "../../src/config/database-context";
import { Area } from "../../src/models/Area";
import { Repository, SelectQueryBuilder, QueryFailedError } from "typeorm";
import { AreaNotFoundError } from "../../src/errors/AreaNotFoundError";
import { InvalidForeignKeyError } from "../../src/errors/InvalidForeignKeyError";
import { InvalidDataError } from "../../src/errors/InvalidDataError";
import { DependencyExistsError } from "../../src/errors/DependencyExistsError";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

jest.mock("../../src/config/database-context");

describe("AreaService", () => {
    let areaService: AreaService;
    let mockRepository: jest.Mocked<Repository<Area>>;
    let qb: jest.Mocked<SelectQueryBuilder<Area>>;

    beforeEach(() => {
        qb = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn(),
            getOne: jest.fn(),
        } as any;

        mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(qb) as any,
        } as any;

        (DatabaseContext.getInstance as jest.Mock).mockReturnValue({
            getRepository: jest.fn().mockReturnValue(mockRepository)
        });

        areaService = new AreaService();
    });

    describe("findAll", () => {
        it("should return all areas with their relations via QueryBuilder", async () => {
            const mockAreas = [{ id: "1" }] as unknown as Area[];
            qb.getMany.mockResolvedValue(mockAreas);

            const result = await areaService.findAll();

            expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('area');
            expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('area.plant', 'plant');
            expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('area.neighbors', 'neighbors');
            expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('area.equipment', 'equipment');
            expect(qb.getMany).toHaveBeenCalled();
            expect(result).toBe(mockAreas);
        });
    });

    describe("findById", () => {
        it("should return an area when found via QueryBuilder", async () => {
            const mockArea = {
                id: "1",
                name: "Area 1",
                locationDescription: "Location 1",
                plantId: "plant1",
                neighbors: [],
                equipment: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            } as unknown as Area;
            qb.getOne.mockResolvedValue(mockArea);

            const result = await areaService.findById("1");

            expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('area');
            expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('area.neighbors', 'neighbors');
            expect(qb.where).toHaveBeenCalledWith('area.id = :id', { id: "1" });
            expect(qb.getOne).toHaveBeenCalled();
            expect(result).toBe(mockArea);
        });

        it("should throw AreaNotFoundError when not found", async () => {
            qb.getOne.mockResolvedValue(null);
            await expect(areaService.findById("1")).rejects.toThrow(AreaNotFoundError);
        });
    });

    describe("create", () => {
        const areaData = { name: "New", locationDescription: "Loc", plantId: "p1" };
        it("should create and return a new area", async () => {
            const saved = {
                ...areaData,
                id: "1",
                neighbors: [],
                equipment: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            } as unknown as Area;
            mockRepository.create.mockReturnValue(saved);
            mockRepository.save.mockResolvedValue(saved);
            // create() calls findById internally -> qb.getOne
            qb.getOne.mockResolvedValue(saved);

            const result = await areaService.create(areaData as any);

            expect(mockRepository.create).toHaveBeenCalledWith(areaData);
            expect(mockRepository.save).toHaveBeenCalledWith(saved);
            expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
            expect(result).toBe(saved);
        });

        it("should throw InvalidForeignKeyError on FK error", async () => {
            mockRepository.create.mockReturnValue({} as any);
            mockRepository.save.mockRejectedValue(new QueryFailedError('', [], new Error('FOREIGN KEY')));

            await expect(areaService.create(areaData as any)).rejects.toThrow(InvalidForeignKeyError);
        });

        it("should throw InvalidDataError on other error", async () => {
            mockRepository.create.mockReturnValue({} as any);
            mockRepository.save.mockRejectedValue(new QueryFailedError('', [], new Error('ERR')));

            await expect(areaService.create(areaData as any)).rejects.toThrow(InvalidDataError);
        });
    });

    describe("update", () => {
        const id = "1";
        const updateData = { name: "Up" };
        it("should update and return area", async () => {
            const existing = {
                id,
                name: "Old",
                locationDescription: "L",
                plantId: "p1",
                neighbors: [],
                equipment: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            } as unknown as Area;
            const updated = { ...existing, ...updateData } as Area;
            qb.getOne.mockResolvedValueOnce(existing).mockResolvedValueOnce(updated);
            mockRepository.save.mockResolvedValue(updated);

            const result = await areaService.update(id, updateData as any);

            expect(mockRepository.save).toHaveBeenCalledWith(existing);
            expect(result).toBe(updated);
        });

        it("should throw if not found", async () => {
            qb.getOne.mockResolvedValue(null);
            await expect(areaService.update(id, updateData as any)).rejects.toThrow(AreaNotFoundError);
        });

        it("should throw InvalidDataError on save error", async () => {
            const existing = { id, name: "Old", locationDescription: "L", plantId: "p1", neighbors: [], equipment: [], createdAt: new Date(), updatedAt: new Date() } as unknown as Area;
            qb.getOne.mockResolvedValue(existing);
            mockRepository.save.mockRejectedValue(new QueryFailedError('', [], new Error('ERR')));

            await expect(areaService.update(id, updateData as any)).rejects.toThrow(InvalidDataError);
        });
    });

    describe("delete", () => {
        const id = "1";
        it("should delete area", async () => {
            const area = { id, name: "A", locationDescription: "L", plantId: "p1", neighbors: [], equipment: [], createdAt: new Date(), updatedAt: new Date() } as unknown as Area;
            qb.getOne.mockResolvedValue(area);
            mockRepository.remove.mockResolvedValue(area);

            await areaService.delete(id);
            expect(mockRepository.remove).toHaveBeenCalledWith(area);
        });

        it("should throw if not found", async () => {
            qb.getOne.mockResolvedValue(null);
            await expect(areaService.delete(id)).rejects.toThrow(AreaNotFoundError);
        });

        it("should throw DependencyExistsError if equipment exists", async () => {
            const area = { id, name: "A", locationDescription: "L", plantId: "p1", neighbors: [], equipment: [{ id: 'e1' }], createdAt: new Date(), updatedAt: new Date() } as unknown as Area;
            qb.getOne.mockResolvedValue(area);
            await expect(areaService.delete(id)).rejects.toThrow(DependencyExistsError);
        });
    });
});
