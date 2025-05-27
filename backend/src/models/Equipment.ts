import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Area } from "./Area";
import { Part } from "./Part";

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

    // legacy single-area relation (keep for backward compatibility)
    @ManyToOne(() => Area, (area: { equipment: any; }) => area.equipment)
    area?: Area;

    @Column({ nullable: true })
    areaId!: string;

    // new multi-area relation
    @ManyToMany(() => Area)
    @JoinTable({
      name: 'equipment_areas',
      joinColumn: { name: 'equipmentId', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'areaId', referencedColumnName: 'id' }
    })
    areas?: Area[];

    @OneToMany(() => Part, (part: { equipment: any; }) => part.equipment)
    parts?: Part[];

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    updatedAt!: Date;
}