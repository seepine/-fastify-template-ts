import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { DataSourceOptions, needDbConnect } from "./.config/db";
import typeormPlugin from "typeorm-fastify-plugin";
import routes from "./.config/routes";
import hooks from "./.config/hooks";
import GracefulShutdownPlugin from 'fastify-graceful-shutdown'

const startTime = new Date();
export default {
  init: async (fastify: FastifyInstance) => {
    if (needDbConnect) {
      fastify.log.info("Wait to connect db...");
      await fastify.register(typeormPlugin, DataSourceOptions);
    } else {
      fastify.log.info("Not find db host, will not connect to the database");
    }
    await hooks(fastify);
    await fastify.register(routes);
    fastify.decorateRequest("user", null);

    fastify.register(GracefulShutdownPlugin, { timeout: 20000 })
      .after(() => {
        fastify.gracefulShutdown(async (signal, next) => {
          if (needDbConnect) {
            fastify.orm.queryResultCache?.clear()
          }
          fastify.log.info(`GracefulShutdown from ${signal}`)
          next()
          fastify.log.info('GracefulShutdown complete')
        })
      })
  },
  handler: async (
    req: FastifyRequest,
    reply: FastifyReply,
    fastify: FastifyInstance
  ) => {
    return {
      status: "up",
      time: startTime,
    };
  },
};
