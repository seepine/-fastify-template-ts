import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getFilesAndFoldersInDir, isFunction } from './utils'
import { ApplicationHook, LifecycleHook } from "fastify/types/hooks";
import { isError } from "util";

function toCamelCase(str): string {
  return str.replace(".ts", "").replace(".js", "").replace(/-([a-z])/g, function (match, letter) {
    return letter.toUpperCase();
  });
}
type Hook = ApplicationHook | LifecycleHook

export default async (fastify: FastifyInstance) => {
  let apiDir = "src/hooks";
  let list = getFilesAndFoldersInDir(apiDir);
  list.forEach(async (obj: any) => {
    if (!obj.name.endsWith(".ts") && !obj.name.endsWith(".js")) {
      return
    }
    let handler = await import(obj.path);
    if (handler.default) {
      handler = handler.default;
    }
    if (isFunction(handler)) {
      const hook = toCamelCase(obj.name)
      fastify.log.info(`Hook [${hook}] register success`)
      if (hook === 'onError') {
        fastify.setErrorHandler(async function (error, request, reply) {
          if (reply.statusCode < 300) {
            reply.status(500)
          }
          return await handler({
            request,
            reply,
            error,
            fastify: this,
            orm: this['orm'],
            log: this['log']
          })
        })
      } else {
        fastify.addHook(hook as Hook, async function (request, reply, payload) {
          let ctx: any = {
            request,
            reply,
            payload,
            fastify: this,
            orm: this['orm'],
            log: this['log']
          }
          return await handler(ctx)
        })
      }
    }
  });
};
