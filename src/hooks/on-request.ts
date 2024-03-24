export default (ctx: HookCtx) => {
  // 路由config配置此值忽略鉴权拦截
  if (ctx.request.routeOptions.config.expose) {
    return
  }

  // 可以在此做权限拦截，例如解析请求头token，并赋值给fastify.user
  // ctx.fastify.user = {
  //   id: '512',
  //   name: "tony",
  // };

  // 若想拦截，抛出异常即可
  // ctx.reply.status(401)
  // throw Error('清先登录')
};
