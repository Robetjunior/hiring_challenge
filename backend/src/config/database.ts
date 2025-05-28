import { DataSource } from "typeorm";
import { Plant } from "../models/Plant";
import { Area } from "../models/Area";
import { Equipment } from "../models/Equipment";
import { Maintenance } from "../models/Maintenance";
import { Part } from "../models/Part";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "opwell.sqlite",
    synchronize: false, 
    logging: true,
    entities: [Plant, Area, Equipment, Part, Maintenance],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations_table"
});