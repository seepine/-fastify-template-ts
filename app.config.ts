type DbConfig = {
  type: "mysql" | "postgres" | "mariadb" | "sqlite" | "oracle" | "mongodb";
  // DB_HOST
  host: string;
  // DB_PORT
  port: number;
  // DB_USERNAME
  username: string;
  // DB_PASSWORD
  password: string;
  // DB_DATABASE
  database: string;
  // DB_CACHE_ENABLED
  cacheEnabled: boolean
  // DB_CACHE_DURATION
  cacheDuration: number
};

type Config = {
  // PORT环境变量
  port: number;
  db: DbConfig;
};

// 应用配置，若配置环境变量其优先级更高
const config: Config = {
  port: 3000,
  db: {
    type: "postgres",
    // 未配置时不会进行数据库连接
    host: "",
    port: 5432,
    username: "postgres",
    password: "123456",
    database: "postgres",
    cacheEnabled: true,
    cacheDuration: 3000
  },
};

export default config;
