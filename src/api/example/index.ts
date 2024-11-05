/*
 * @Author: jdm
 * @Date: 2024-05-30 10:29:46
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-30 14:44:41
 * @FilePath: \vite-vue3-jdm\src\api\example\index.ts
 * @Description:
 *
 */
import request from '@/utils/http/axios';
import { BasicModel } from '../types/base';

enum API {
  example = '/dailyEnglish',
  hupu = 'hotlist/huPu',
  mockUserInfo = '/mock/user/info',
  mockLogin = '/mock/user/login',
  mockPermission = '/mock/permission/menu',
  mockPermission1 = '/mock/permission/menu1',
}

export const exampleAPI = () => {
  return request.get<BasicModel[]>({
    url: API.example,
    params: {
      type: 'sj',
    },
  });
};

export const exampleHupuAPI = () => {
  return request.get<BasicModel[]>({
    url: API.hupu,
  });
};

export const mockGetUserInfoAPI = () => {
  return request.get<BasicModel[]>({
    url: API.mockUserInfo,
  });
};

export const mockPostAPI = (data: any) => {
  return request.post<BasicModel[]>({
    url: API.mockLogin,
    data,
  });
};

export const mockPermissionAPI = () => {
  return request.get<BasicModel[]>({
    url: API.mockPermission,
  });
};

export const mockPermission1API = () => {
  return request.get<BasicModel[]>({
    url: API.mockPermission1,
  });
};
