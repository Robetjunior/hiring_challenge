// backend/src/dtos/MaintenanceDTO.ts
import {
  IsString,
  IsOptional,
  IsDateString,
  Min,
  IsIn,
} from "class-validator";

export class CreateMaintenanceDTO {
  @IsString() title!: string;

  @IsOptional()
  @IsDateString() fixedDate?: string;

  @IsOptional()
  @Min(1) intervalMonths?: number;

  @IsOptional()
  @IsDateString() dueDate?: string;

  @IsString() partId!: string;
  @IsString() equipmentId!: string;
  @IsString() areaId!: string;
  @IsString() plantId!: string;

  @IsOptional()
  @IsIn(["piece", "equipment"])
  baseType?: "piece" | "equipment";
}

export class UpdateMaintenanceDTO {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsDateString() fixedDate?: string;
  @IsOptional() @Min(1) intervalMonths?: number;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsString() partId?: string;
  @IsOptional() @IsString() equipmentId?: string;
  @IsOptional() @IsString() areaId?: string;
  @IsOptional() @IsString() plantId?: string;
  @IsOptional() @IsIn(["piece", "equipment"]) baseType?: "piece" | "equipment"; 
}
