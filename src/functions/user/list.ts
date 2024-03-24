import { User } from "../../models/user";

// http://127.0.0.1:3000/user/list
// 自动生成接口地址 /user/list，默认支持 'GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'
export default async ({ orm }: Ctx) => {
  return await orm.manager.find(User)
}