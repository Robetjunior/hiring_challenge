import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Plant } from "./Plant";
import { Equipment } from "./Equipment";

@Entity()
export class Area {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    locationDescription!: string;

    @ManyToOne(() => Plant, (plant: { areas: any; }) => plant.areas)
    plant?: Plant;

    @Column()
    plantId!: string;

    @OneToMany(() => Equipment, (equipment: { area: any; }) => equipment.area)
    equipment?: Equipment[];

    @ManyToMany(() => Area, (area: { neighbors: any; }) => area.neighbors)
    @JoinTable({
      name: 'area_neighbors',
      joinColumn: { name: 'areaId', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'neighborId', referencedColumnName: 'id' }
    })
    neighbors?: Area[];

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    updatedAt!: Date;
}