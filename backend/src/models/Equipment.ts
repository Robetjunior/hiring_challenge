import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Area } from "./Area";
import { Part } from "./Part";
import { Maintenance } from "./Maintenance";

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  manufacturer!: string;

  @Column()
  serialNumber!: string;

  @Column({ type: "date" })
  initialOperationsDate!: Date;

  // legacy single-area
  @ManyToOne(() => Area, (area) => area.equipment)
  area?: Area;
  @Column({ nullable: true })
  areaId!: string;

  // new many-to-many
  @ManyToMany(() => Area)
  @JoinTable({
    name: "equipment_areas",
    joinColumn: { name: "equipmentId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "areaId", referencedColumnName: "id" },
  })
  areas?: Area[];

  @OneToMany(() => Part, (part) => part.equipment)
  parts?: Part[];

  @OneToMany(() => Maintenance, (m) => m.equipment)
  maintenances?: Maintenance[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
