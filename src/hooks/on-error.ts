import { STATUS_CODES } from 'node:http'

/**
 * 错误hook，是setErrorHandler，能拦截所有错误
 */
export default ({ error, reply, log }: HookCtx) => {
  if (error.name === 'Error') {
    // 使得普通错误异常不记录堆栈日志
    return { "statusCode": reply.statusCode, "error": STATUS_CODES[reply.statusCode], "message": error.message }
  }
  log.error(error)
  return { "statusCode": reply.statusCode, "error": STATUS_CODES[reply.statusCode], message: '内部服务器错误' }
};
