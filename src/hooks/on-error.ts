/**
 * 错误hook，其实不是onError，而是setErrorHandler，能拦截所有错误
 */
export default (ctx: HookCtx) => {
  ctx.log.info(`on error:  ${ctx.error.message}`);
  return {
    code: 1,
    msg: ctx.error.message
  }
};
