import { Body, Controller, Get, Path, Post, Put, Delete, Route, Tags } from "tsoa";
import { Equipment } from "../models/Equipment";
import { EquipmentService } from "../services/EquipmentService";
import { EquipmentNotFoundError } from "../errors/EquipmentNotFoundError";
import { InvalidForeignKeyError } from "../errors/InvalidForeignKeyError";
import { InvalidDataError } from "../errors/InvalidDataError";
import { DependencyExistsError } from "../errors/DependencyExistsError";
import { CreateEquipmentDTO, UpdateEquipmentDTO } from "../dtos/EquipmentDTO";

@Route("equipment")
@Tags("Equipment")
export class EquipmentController extends Controller {
    private equipmentService: EquipmentService;

    constructor() {
        super();
        this.equipmentService = new EquipmentService();
    }

    @Get()
    public async getEquipment(): Promise<Equipment[]> {
        return this.equipmentService.findAll();
    }

    @Get("{equipmentId}")
    public async getEquipmentById(@Path() equipmentId: string): Promise<Equipment> {
        try {
            return await this.equipmentService.findById(equipmentId);
        } catch (error) {
            if (error instanceof EquipmentNotFoundError) {
                this.setStatus(EquipmentNotFoundError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Post()
    public async createEquipment(
        @Body() requestBody: CreateEquipmentDTO
    ): Promise<Equipment> {
        try {
            return this.equipmentService.create(requestBody);
        } catch (error) {
            if (error instanceof InvalidForeignKeyError) {
                this.setStatus(InvalidForeignKeyError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidDataError) {
                this.setStatus(InvalidDataError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Put("{equipmentId}")
    public async updateEquipment(
        @Path() equipmentId: string,
        @Body() requestBody: UpdateEquipmentDTO
    ): Promise<Equipment> {
        try {
            return await this.equipmentService.update(equipmentId, requestBody);
        } catch (error) {
            if (error instanceof EquipmentNotFoundError) {
                this.setStatus(EquipmentNotFoundError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidForeignKeyError) {
                this.setStatus(InvalidForeignKeyError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidDataError) {
                this.setStatus(InvalidDataError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Delete("{equipmentId}")
    public async deleteEquipment(@Path() equipmentId: string): Promise<void> {
        try {
            await this.equipmentService.delete(equipmentId);
            this.setStatus(204);
        } catch (error) {
            if (error instanceof EquipmentNotFoundError) {
                this.setStatus(EquipmentNotFoundError.httpStatusCode);
                throw error;
            }
            if (error instanceof DependencyExistsError) {
                this.setStatus(DependencyExistsError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }
}