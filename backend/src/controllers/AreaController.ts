import { Body, Controller, Get, Path, Post, Put, Delete, Route, Tags } from "tsoa";
import { Area } from "../models/Area";
import { AreaService } from "../services/AreaService";
import { AreaNotFoundError } from "../errors/AreaNotFoundError";
import { InvalidForeignKeyError } from "../errors/InvalidForeignKeyError";
import { InvalidDataError } from "../errors/InvalidDataError";
import { DependencyExistsError } from "../errors/DependencyExistsError";

@Route("areas")
@Tags("Area")
export class AreaController extends Controller {
    private areaService: AreaService;

    constructor() {
        super();
        this.areaService = new AreaService();
    }

    @Get()
    public async getAreas(): Promise<Area[]> {
        return this.areaService.findAll();
    }

    @Get("{areaId}")
    public async getArea(@Path() areaId: string): Promise<Area> {
        try {
            return await this.areaService.findById(areaId);
        } catch (error) {
            if (error instanceof AreaNotFoundError) {
                this.setStatus(AreaNotFoundError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Post()
    public async createArea(
        @Body() requestBody: Pick<Area, "name" | "locationDescription" | "plantId">
    ): Promise<Area> {
        try {
            return await this.areaService.create(requestBody);
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

    @Put("{areaId}")
    public async updateArea(
        @Path() areaId: string,
        @Body() requestBody: Partial<Pick<Area, "name" | "locationDescription" | "plantId">>
    ): Promise<Area> {
        try {
            return await this.areaService.update(areaId, requestBody);
        } catch (error) {
            if (error instanceof AreaNotFoundError) {
                this.setStatus(AreaNotFoundError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidDataError) {
                this.setStatus(InvalidDataError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Delete("{areaId}")
    public async deleteArea(@Path() areaId: string): Promise<void> {
        try {
            await this.areaService.delete(areaId);
            this.setStatus(204);
        } catch (error) {
            if (error instanceof AreaNotFoundError) {
                this.setStatus(AreaNotFoundError.httpStatusCode);
                throw error;
            }
            if (error instanceof DependencyExistsError) {
                this.setStatus(DependencyExistsError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Get("{areaId}/neighbors")
    public async getNeighbors(@Path() areaId: string): Promise<Area[]> {
        try {
            return await this.areaService.getNeighbors(areaId);
        } catch (error) {
            if (error instanceof AreaNotFoundError) {
                this.setStatus(AreaNotFoundError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Post("{areaId}/neighbors/{neighborId}")
    public async addNeighbor(
        @Path() areaId: string,
        @Path() neighborId: string
    ): Promise<void> {
        try {
            await this.areaService.addNeighbor(areaId, neighborId);
            this.setStatus(204);
        } catch (error) {
            if (error instanceof AreaNotFoundError) {
                this.setStatus(AreaNotFoundError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidDataError) {
                this.setStatus(InvalidDataError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidForeignKeyError) {
                this.setStatus(InvalidForeignKeyError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Delete("{areaId}/neighbors/{neighborId}")
    public async removeNeighbor(
        @Path() areaId: string,
        @Path() neighborId: string
    ): Promise<void> {
        try {
            await this.areaService.removeNeighbor(areaId, neighborId);
            this.setStatus(204);
        } catch (error) {
            if (error instanceof AreaNotFoundError) {
                this.setStatus(AreaNotFoundError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }
}
