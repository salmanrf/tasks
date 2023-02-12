import { DataSource } from "typeorm";
import { Task } from "../models/entities/task.entity";

export let AppDataSource: DataSource;

export function initDataSource() {
  AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: +process.env.DB_PORT,
    entities: [Task],
    synchronize: true,
    logging: true,
  });

  return AppDataSource;
}
