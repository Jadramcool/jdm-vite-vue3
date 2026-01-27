import request from '@/utils/http/axios';
import type { LoginParams, RegisterParams, UpdateUserParams } from '#/api/user';
import { BasicModel } from '../types/base';

enum API {
  login = '/user/login',
  register = '/user/register',
  userInfo = '/user/info',
  userMenu = '/user/menu',
  update = '/user/update',
  checkPassword = '/user/checkPassword',
  updatePassword = '/user/updatePassword',
}

/**
 * @description: 登录
 * @param {LoginParams} data
 */
export const login = (data: LoginParams): Promise<System.User> => {
  return request.post<System.User>({
    url: API.login,
    data,
  });
};

/**
 * @description: 注册
 * @param {RegisterParams} data
 */
export const register = (data: RegisterParams): Promise<System.User> => {
  return request.post<System.User>({
    url: API.register,
    data,
  });
};

/**
 * @description: 获取用户信息
 */
export const getUserInfo = (): Promise<System.User> => {
  return request.get<System.User>({
    url: API.userInfo,
  });
};

/**
 * @description: 获取菜单
 */
export const menuAPI = (): Promise<BasicModel[]> => {
  return request.get<BasicModel[]>({
    url: API.userMenu,
  });
};

/**
 * @description: 更新用户信息
 * @param {UpdateUserParams} data
 */
export const update = (data: UpdateUserParams): Promise<System.User> => {
  return request.put<System.User>({
    url: API.update,
    data,
  });
};

/**
 * @description: 检查密码
 * @param {{ password: string }} data
 */
export const checkPassword = (data: { password: string }): Promise<boolean> => {
  return request.post<boolean>({
    url: API.checkPassword,
    data,
  });
};

/**
 * @description: 更新密码
 * @param {{ oldPassword: string; newPassword: string }} data
 */
export const updatePassword = (data: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> => {
  return request.put<void>({
    url: API.updatePassword,
    data,
  });
};
