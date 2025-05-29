import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Area } from "./Area";
import { Maintenance } from "./Maintenance";

@Entity()
export class Plant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @OneToMany(() => Area, (area) => area.plant)
  areas?: Area[];

  @OneToMany(() => Maintenance, (m) => m.plant)
  maintenances?: Maintenance[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
