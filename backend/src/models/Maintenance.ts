// backend/src/models/Maintenance.ts

import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { Part } from "./Part";
import { Equipment } from "./Equipment";
import { Area } from "./Area";
import { Plant } from "./Plant";

@Entity()
export class Maintenance {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "date" })
  dueDate!: Date;

  @Column({ type: "int", nullable: true })
  intervalMonths?: number;

  @Column({ type: "date", nullable: true })
  fixedDate?: Date;

  @Column({ type: "varchar", length: 16, default: "piece" })
  baseType!: "piece" | "equipment";

  @ManyToOne(() => Part, part => part.maintenances)
  part!: Part;
  @Column() partId!: string;

  @ManyToOne(() => Equipment, equipment => equipment.maintenances)
  equipment!: Equipment;
  @Column() equipmentId!: string;

  @ManyToOne(() => Area, area => area.maintenances)
  area!: Area;
  @Column() areaId!: string;

  @ManyToOne(() => Plant, plant => plant.maintenances)
  plant!: Plant;
  @Column() plantId!: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
