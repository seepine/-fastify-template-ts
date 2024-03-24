/**
 * 发送前hook，string或playload不会进入pre-serialization，所以此处加上拦截
 */
export default (ctx: HookCtx) => {
  if (ctx.payload === undefined || ctx.payload === null) {
    // 空，包装一层
    ctx.reply.header('content-type', 'application/json;charset=utf-8')
    return JSON.stringify({
      code: 0,
      data: undefined
    })
  }
  if (typeof ctx.payload === 'string') {
    ctx.reply.header('content-type', 'application/json;charset=utf-8')
    if (!ctx.payload.startsWith('{"code":')) {
      // 纯字符串，包装一层
      return JSON.stringify({
        code: 0,
        data: ctx.payload
      })
    }
  }
  return ctx.payload
};
