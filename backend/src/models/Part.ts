import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Equipment } from "./Equipment";
import { Maintenance } from "./Maintenance";

export enum PartType {
  ELECTRIC = "electric",
  ELECTRONIC = "electronic",
  MECHANICAL = "mechanical",
  HYDRAULICAL = "hydraulical",
}

@Entity()
export class Part {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "varchar", default: PartType.MECHANICAL })
  type!: PartType;

  @Column()
  manufacturer!: string;

  @Column()
  serialNumber!: string;

  @Column({ type: "date" })
  installationDate!: Date;

  @ManyToOne(() => Equipment, (eq) => eq.parts)
  equipment?: Equipment;

  @Column()
  equipmentId!: string;

  @OneToMany(() => Maintenance, (m) => m.part)
  maintenances?: Maintenance[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
