# Fastify template typescript

> 基于 [fastify.dev 4.26.x](https://fastify.dev/docs/v4.26.x/)

技术要点
- 框架：fastify
- ORM：typeorm + postgres
- 日志：pino + pino-pretty
- 热重载：nodemon
- 优雅停机：fastify-graceful-shutdown
- 部署方式：Docker
- 体积精简：@vercel/nft

## 一、编写接口

> 在 `src/functions` 中新建任意 ts 文件即可，文件路径即接口路径

### 1.简单写法

如创建 `src/functions/hello.ts`，接口则为 `http://127.0.0.1:3000/hello`

```js
export default async ({ request, reply, fastify }: Ctx) => {
  // request.query request.body ...
  return {
    a: "hello world",
  };
};
```

### 2.自定义参数

> 可自定义参数参考文档 [https://fastify.dev/docs/v4.26.x/Reference/Routes/#routes-options，和文档基本保持一致](https://fastify.dev/docs/v4.26.x/Reference/Routes/#routes-options%EF%BC%8C%E5%92%8C%E6%96%87%E6%A1%A3%E5%9F%BA%E6%9C%AC%E4%BF%9D%E6%8C%81%E4%B8%80%E8%87%B4)

```js
export default {
  method: ["GET", "POST"],
  handler: async (ctx) => {
    return {
      a: "hello world",
    };
  },
} as Route;
```

## 二、数据库

> `ORM` 框架使用 `typeorm` ，使用可参考文档 [https://www.typeorm.org/](https://www.typeorm.org/)

### 1. 数据库连接

修改根目录 `app.config.ts` 中的 `db config` 即可，默认使用 `postgres` 数据库，可自行根据文档修改为其他类型，安装对应驱动依赖即可

```ts
db: {
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    username: "postgres",
    password: "123456",
    database: "postgres",
}
```

### 2.创建模型

在 `src/models` 目录中定义模型即可，`ORM` 框架会自行建表，例如创建文件 `src/models/user.ts`

```ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  telephone: string;
}

```

### 3.使用

通过接口传入的 `fastify` 上下文调用 `typeorm` 相关方法即可

```ts
import { User } from "../models/user";

export default async function ({ orm }: Ctx) {
  const list = await orm.manager.find(User);
  console.log(list);
  return list;
}
```

## 三、钩子

在目录 `src/hooks` 下自行创建钩子文件即可，文件名即钩子名，其会自动注册进 `fastify`

例如创建文件 `src/hooks/on-request.ts`

```ts
export default ({ request, fastify }: HookCtx) => {
  fastify.log.info(`on request: headers ${request.headers.accept}`);
  // 可以在此做权限拦截，并赋值给user，user类型 AuthUser 可在env.d.ts 修改
  fastify.user = {
    id: 512,
    name: "tony",
  };
  // 若鉴权失败，可用过reply设置状态码，并 throw Error 抛出异常
};

```

更多钩子请查看 [官方文档Hooks](https://www.fastify.cn/docs/latest/Hooks/#prehandler)

## 四、部署

已提供 `Dockerfile`，直接 `docker build -t demo-app -f docker/Dockerfile .` 或通过 `cicd` 构建镜像即可，当然也可以直接源码部署运行

可使用的环境变量

```ini
# 启动端口
PORT=3000
# 数据库相关
DB_HOST=192.168.100.151
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_DATABASE=postgres
```
