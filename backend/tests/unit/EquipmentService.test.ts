// tests/unit/EquipmentService.test.ts

import { EquipmentService } from "../../src/services/EquipmentService";
import { DatabaseContext } from "../../src/config/database-context";
import { Equipment } from "../../src/models/Equipment";
import { Repository, QueryFailedError, SelectQueryBuilder } from "typeorm";
import { EquipmentNotFoundError } from "../../src/errors/EquipmentNotFoundError";
import { DependencyExistsError } from "../../src/errors/DependencyExistsError";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Area } from "../../src/models/Area";
import { InvalidDataError } from "../../src/errors/InvalidDataError";

jest.mock("../../src/config/database-context");

describe("EquipmentService", () => {
  let equipmentService: EquipmentService;
  let mockRepository: jest.Mocked<Repository<Equipment>>;
  let qb: jest.Mocked<SelectQueryBuilder<Equipment>>;

  const fakeArea1 = {
      id: "a1",
      name: "Area 1",
      locationDescription: "Loc 1",
      plantId: "p1",
      neighbors: [{ id: "a2" }],
      equipment: [],
      createdAt: new Date(),
      updatedAt: new Date(),
  } as unknown as Area;

  const fakeArea2 = {
      id: "a2",
      name: "Area 2",
      locationDescription: "Loc 2",
      plantId: "p1",
      neighbors: [{ id: "a1" }],
      equipment: [],
      createdAt: new Date(),
      updatedAt: new Date(),
  } as unknown as Area;

  beforeEach(() => {
    qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where:            jest.fn().mockReturnThis(),
      getMany:          jest.fn(),
      getOne:           jest.fn(),
    } as any;

    mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(qb) as any,
      create:             jest.fn(),
      save:               jest.fn(),
      findOneBy:          jest.fn(),
      remove:             jest.fn(),
    } as any;

    (DatabaseContext.getInstance as jest.Mock).mockReturnValue({
      getRepository: () => mockRepository
    });

    equipmentService = new EquipmentService();

    // inject fake areaService
    (equipmentService as any).areaService = {
      findById:    jest.fn(id => Promise.resolve(id === "a1" ? fakeArea1 : fakeArea2)),
      getNeighbors: jest.fn(id => Promise.resolve(id === "a1" ? [fakeArea2] : [fakeArea1])),
    };
  });

  describe("findAll", () => {
    it("deve retornar todos os equipamentos com as relações via QueryBuilder", async () => {
      const mockList = [{ id: "1" }] as Equipment[];
      qb.getMany.mockResolvedValue(mockList);

      const result = await equipmentService.findAll();

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith("equipment");
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith("equipment.areas", "areas");
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith("equipment.parts", "parts");
      expect(qb.getMany).toHaveBeenCalled();
      expect(result).toBe(mockList);
    });
  });

  describe("findById", () => {
    it("deve retornar um equipamento existente via QueryBuilder", async () => {
      const mockEq = { id: "1" } as Equipment;
      qb.getOne.mockResolvedValue(mockEq);

      const result = await equipmentService.findById("1");

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith("equipment");
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith("equipment.areas", "areas");
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith("equipment.parts", "parts");
      expect(qb.where).toHaveBeenCalledWith("equipment.id = :id", { id: "1" });
      expect(qb.getOne).toHaveBeenCalled();
      expect(result).toBe(mockEq);
    });

    it("deve lançar EquipmentNotFoundError se não existir", async () => {
      qb.getOne.mockResolvedValue(null);
      await expect(equipmentService.findById("1")).rejects.toThrow(EquipmentNotFoundError);
    });
  });

  describe("create", () => {
    const now = new Date();
    const dto = {
      name: "EQ",
      manufacturer: "MFR",
      serialNumber: "SN",
      initialOperationsDate: now,
      areas: ["a1", "a2"]
    };

    it("deve criar e retornar o equipamento", async () => {
      const saved = { ...dto, id: "1", createdAt: now, updatedAt: now } as any as Equipment;
      mockRepository.create.mockReturnValue(saved);
      mockRepository.save.mockResolvedValue(saved);
      qb.getOne.mockResolvedValue(saved);

      const result = await equipmentService.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith();
      expect(mockRepository.save).toHaveBeenCalledWith(saved);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toBe(saved);
    });

    it("deve recusar se não passar nenhuma área", async () => {
      await expect(equipmentService.create({ ...dto, areas: [] }))
        .rejects.toThrow(InvalidDataError);
    });

    it("deve repassar QueryFailedError se save falhar por FK", async () => {
      mockRepository.create.mockReturnValue({} as any);
      mockRepository.save.mockRejectedValue(new QueryFailedError("", [], new Error("FOREIGN KEY")));

      await expect(equipmentService.create(dto))
        .rejects.toThrow(QueryFailedError);
    });

    it("deve repassar QueryFailedError se save falhar por outro motivo", async () => {
      mockRepository.create.mockReturnValue({} as any);
      mockRepository.save.mockRejectedValue(new QueryFailedError("", [], new Error("other")));

      await expect(equipmentService.create(dto))
        .rejects.toThrow(QueryFailedError);
    });
  });

  describe("update", () => {
    const now = new Date();
    const existing = {
      id: "1",
      name: "old",
      manufacturer: "m",
      serialNumber: "s",
      initialOperationsDate: now,
      areas: ["a1"],
      createdAt: now,
      updatedAt: now
    } as any as Equipment;

    it("deve atualizar e retornar", async () => {
      const updated = { ...existing, name: "new" } as Equipment;
      qb.getOne.mockResolvedValueOnce(existing).mockResolvedValueOnce(updated);
      mockRepository.save.mockResolvedValue(updated);

      const result = await equipmentService.update("1", { name: "new" });

      expect(mockRepository.save).toHaveBeenCalledWith(existing);
      expect(result).toBe(updated);
    });

    it("deve lançar se não existir", async () => {
      qb.getOne.mockResolvedValue(null);
      await expect(equipmentService.update("1", {}))
        .rejects.toThrow(EquipmentNotFoundError);
    });

    it("deve repassar QueryFailedError para FK", async () => {
      qb.getOne.mockResolvedValue(existing);
      mockRepository.save.mockRejectedValue(new QueryFailedError("", [], new Error("FOREIGN KEY")));
      await expect(equipmentService.update("1", {}))
        .rejects.toThrow(QueryFailedError);
    });

    it("deve repassar QueryFailedError para outros erros", async () => {
      qb.getOne.mockResolvedValue(existing);
      mockRepository.save.mockRejectedValue(new QueryFailedError("", [], new Error("other")));
      await expect(equipmentService.update("1", {}))
        .rejects.toThrow(QueryFailedError);
    });
  });

  describe("delete", () => {
    it("deve remover existente", async () => {
      const eq = { id: "1" } as Equipment;
      mockRepository.findOneBy.mockResolvedValue(eq);

      await equipmentService.delete("1");

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: "1" });
      expect(mockRepository.remove).toHaveBeenCalledWith(eq);
    });

    it("deve lançar se não existir", async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(equipmentService.delete("1"))
        .rejects.toThrow(EquipmentNotFoundError);
    });

    it("deve repassar DependencyExistsError se remover falhar", async () => {
      const eq = { id: "1" } as Equipment;
      mockRepository.findOneBy.mockResolvedValue(eq);
      mockRepository.remove.mockRejectedValue(new QueryFailedError("", [], new Error("fk")));

      await expect(equipmentService.delete("1"))
        .rejects.toThrow(DependencyExistsError);
    });
  });
});
