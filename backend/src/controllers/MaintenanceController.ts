import {
  Body, Controller, Delete, Get, Path, Post, Put, Route, Tags
} from "tsoa";
import { Maintenance } from "../models/Maintenance";
import { MaintenanceService } from "../services/MaintenanceService";
import { CreateMaintenanceDTO, UpdateMaintenanceDTO } from "../dtos/MaintenanceDTO";
import { NotFoundError } from "../errors/NotFoundError";

@Route("maintenance")
@Tags("Maintenance")
export class MaintenanceController extends Controller {
  private svc = new MaintenanceService(); 

  @Get()
  public async getAll(): Promise<Maintenance[]> {
    return this.svc.findAll();
  }

  @Get("upcoming")
  public async getUpcoming(): Promise<Maintenance[]> {
    return this.svc.findUpcoming();
  }

  @Get("{id}")
  public async getById(@Path() id: string): Promise<Maintenance> {
    try {
      return await this.svc.findById(id);
    } catch (err) {
      if (err instanceof NotFoundError) {
        this.setStatus(404);
        ;(err as any).status = 404;
        throw err;
      }
      throw err;
    }
  }

  @Post()
  public async create(@Body() dto: CreateMaintenanceDTO): Promise<Maintenance> {
    try {
      return await this.svc.create(dto);
    } catch (err) {
      if (err instanceof NotFoundError) {
        this.setStatus(404);
        ;(err as any).status = 404;
        throw err;
      }
      throw err;
    }
  }

  @Put("{id}")
    public async update(
      @Path() id: string,
      @Body() dto: UpdateMaintenanceDTO
    ): Promise<Maintenance> {
      try {
        return await this.svc.update(id, dto);
      } catch (err) {
        if (err instanceof NotFoundError) {
          this.setStatus(404);
          throw err;
        }
        if (err instanceof NotFoundError) {
          this.setStatus(404);
          ;(err as any).status = 404;
          throw err;
        }
        throw err;
      }
    }

  @Delete("{id}")
  public async delete(@Path() id: string): Promise<void> {
    try {
      await this.svc.delete(id);
      this.setStatus(204);
    } catch (err) {
      if (err instanceof NotFoundError) {
        this.setStatus(404);
        ;(err as any).status = 404;
        throw err;
      }
      throw err;
    }
  }
}
