// http://127.0.0.1:3000/health
// 自动生成接口地址 /health，支持 GET、POST
export default {
  method: ["GET", "POST"],
  config: {
    // 额外属性可以附加在这里，让hook能够拿到，例如规定expose表示接口不进行鉴权
    expose: true
  },
  handler: async (ctx) => {
    return {
      status: "up"
    };
  },
} as Route;
