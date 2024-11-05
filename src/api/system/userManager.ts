/*
 * @Author: Jay
 * @Date: 2024-05-30 10:29:46
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-30 17:46:14
 * @FilePath: \vite-vue3-jdm\src\api\system\userManager.ts
 * @Description:
 *
 */
import request from '@/utils/http/axios';
// import qs from 'qs';
import { BasicModel } from '../types/base';

enum API {
  userList = '/system/user/list',
}

/**
 * @description: 获取用户列表
 */
// export const userList = (params: any) => {
//   return request.get<BasicModel[]>({
//     url: API.userList,
//     params,
//     paramsSerializer: (params) => {
//       return qs.stringify(params, { encode: true, arrayFormat: 'repeat' });
//     },
//   });
// };

/**
 * @description: 获取用户列表
 */
export const userList = (params: any) => {
  // params所有参数都转json
  // Object.entries(params).forEach(([key, value]) => {
  //   if (Array.isArray(value) || typeof value === 'object') {
  //     params[key] = JSON.stringify(value);
  //   }
  // });
  return request.get<BasicModel[]>({
    url: API.userList,
    params,
  });
};
