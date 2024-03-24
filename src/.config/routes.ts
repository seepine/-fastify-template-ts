import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getFilesAndFoldersInDir, isObject } from './utils'

export default (fastify: FastifyInstance, opts: FastifyPluginOptions, done: (err?: Error) => void) => {
  let apiDir = opts.apiDir || "src/functions";
  let list = getFilesAndFoldersInDir(apiDir);
  list.forEach(async (obj: any) => {
    if (!obj.name.endsWith(".ts") && !obj.name.endsWith(".js")) {
      return
    }
    let handler = await import(obj.path);
    if (handler.default) {
      handler = handler.default;
    }
    let route =
      isObject(handler)
        ? {
          ...handler,
        }
        : {
          handler,
        };
    fastify.route({
      ...route,
      method: route.method || ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'],
      url: obj.url,
      handler: async function (req, reply) {
        return route.handler({
          request: req,
          reply,
          fastify: this,
          orm: this['orm'],
          log: this['log']
        });
      },
    });
  });

  done();
};
