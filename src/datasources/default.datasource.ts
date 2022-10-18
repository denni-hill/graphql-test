import { DataSource } from "typeorm";
import { ConfigService } from "../config";
import entities from "../entities";

let defaultDataSource: DataSource;

export const getDefaultDataSource = () => {
  if (defaultDataSource === undefined)
    defaultDataSource = new DataSource({
      type: "postgres",
      host: ConfigService.get("DATABASE_HOST"),
      port: Number(ConfigService.get("DATABASE_PORT")),
      database: ConfigService.get("DATABASE_NAME"),
      username: ConfigService.get("DATABASE_USER"),
      password: ConfigService.get("DATABASE_PASSWORD"),
      entities,
      synchronize: true
    });

  return defaultDataSource;
};
