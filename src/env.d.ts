import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  RouteOptions,
  RouteShorthandOptions,
  ResolveFastifyReplyReturnType,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  RouteGenericInterface,
  ContextConfigDefault,
  FastifySchema,
  FastifyTypeProviderDefault,
  FastifyBaseLogger,
  FastifyRequestContext
} from "fastify";

import { DataSource } from 'typeorm';

interface AuthUser {
  id: string
  name: string
}

declare module "fastify" {
  interface FastifyInstance {
    user: AuthUser;
  }
}

declare global {
  type Ctx<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    ContextConfig = FastifyContextConfig & FastifyRouteConfig & ContextConfig & { [x: string]: any },
    SchemaCompiler extends FastifySchema = FastifySchema,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
    Logger extends FastifyBaseLogger = FastifyBaseLogger
  > = {
    request: FastifyRequest<RouteGeneric, RawServer, RawRequest, SchemaCompiler, TypeProvider, ContextConfig, Logger>,
    reply: FastifyReply<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig, SchemaCompiler, TypeProvider>,
    orm: DataSource & {
      [namespace: string]: DataSource;
    };
    fastify: FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>,
    log: Logger
  }
  type RouteHandler<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    ContextConfig = ContextConfigDefault,
    SchemaCompiler extends FastifySchema = FastifySchema,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
    Logger extends FastifyBaseLogger = FastifyBaseLogger
  > = (
    ctx: Ctx
    // This return type used to be a generic type argument. Due to TypeScript's inference of return types, this rendered returns unchecked.
  ) => ResolveFastifyReplyReturnType<TypeProvider, SchemaCompiler, RouteGeneric>


  interface Route<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    ContextConfig = ContextConfigDefault,
    SchemaCompiler extends FastifySchema = FastifySchema,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
    Logger extends FastifyBaseLogger = FastifyBaseLogger
  > extends RouteShorthandOptions<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig, SchemaCompiler, TypeProvider, Logger> {
    method: HTTPMethods | HTTPMethods[];
    handler: RouteHandler<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig, SchemaCompiler, TypeProvider, Logger>;
  }

  type HookCtx<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    ContextConfig = FastifyContextConfig & FastifyRouteConfig & ContextConfig & { [x: string]: any },
    SchemaCompiler extends FastifySchema = FastifySchema,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
    Logger extends FastifyBaseLogger = FastifyBaseLogger
  > = {
    request: FastifyRequest<RouteGeneric, RawServer, RawRequest, SchemaCompiler, TypeProvider, ContextConfig, Logger>,
    reply: FastifyReply,
    payload?: any,
    error?: Error,
    fastify: FastifyInstance,
    log: FastifyBaseLogger
  }
}