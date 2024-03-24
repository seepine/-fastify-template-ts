const path = require("node:path");
import { DataSourceOptions as Options } from "typeorm";
import appConfig from "../../app.config";

const modelsPath = path.join(process.cwd(), "src/models");
const dbConfig = appConfig.db;
const host = process.env["DB_HOST"] || dbConfig.host;

const cacheEnabled = process.env["DB_CACHE_ENABLED"] === 'true' ? true : dbConfig.cacheEnabled
export const DataSourceOptions: Options = {
  type: dbConfig.type,
  host: host,
  port: parseInt(process.env["DB_PORT"]) || dbConfig.port,
  username: process.env["DB_USERNAME"] || dbConfig.username,
  password: process.env["DB_PASSWORD"] || dbConfig.password,
  database: process.env["DB_DATABASE"] || dbConfig.database,
  synchronize: true,
  logging: process.env["MODE"] !== "prod",
  entities: [modelsPath + "/*.ts", modelsPath + "/*.js"],
  subscribers: [],
  migrations: [],
  cache: cacheEnabled ? {
    type: 'database',
    duration: parseInt(process.env["DB_CACHE_DURATION"]) || dbConfig.cacheDuration,
    tableName: "z_typeorm_query_result_cache",
    alwaysEnabled: true
  } : false,
};
export const needDbConnect = host && host.length > 4;
