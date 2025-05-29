import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Plant } from "./Plant";
import { Equipment } from "./Equipment";
import { Maintenance } from "./Maintenance";

@Entity()
export class Area {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  locationDescription!: string;

  @ManyToOne(() => Plant, (plant) => plant.areas)
  plant?: Plant;
  @Column()
  plantId!: string;

  @OneToMany(() => Equipment, (equipment) => equipment.area)
  equipment?: Equipment[];

  @ManyToMany(() => Area, (a) => a.neighbors)
  @JoinTable({
    name: "area_neighbors",
    joinColumn: { name: "areaId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "neighborId", referencedColumnName: "id" },
  })
  neighbors?: Area[];

  @OneToMany(() => Maintenance, (m) => m.area)
  maintenances?: Maintenance[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
