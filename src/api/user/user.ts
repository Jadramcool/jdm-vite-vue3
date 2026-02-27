import request from '@/utils/http/axios';
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
 * @param {loginModel} data
 */
export const login = (data: System.loginModel) => {
  return request.post<System.User>({
    url: API.login,
    data,
  });
};

/**
 * @description: 注册
 * @param {loginModel} data
 */
export const register = (data: System.loginModel) => {
  return request.post<System.User>({
    url: API.register,
    data,
  });
};

/**
 * @description: 获取用户信息
 */
export const getUserInfo = () => {
  return request.get<System.User>({
    url: API.userInfo,
  });
};

/**
 * @description: 获取菜单
 */
export const menuAPI = () => {
  return request.get<BasicModel[]>({
    url: API.userMenu,
  });
};

/**
 * @description: 更新用户信息
 */
export const update = (data: Partial<System.User>) => {
  return request.put<System.User>({
    url: API.update,
    data,
  });
};

/**
 * @description: 检查密码
 */
export const checkPassword = (data: { password: string }) => {
  return request.post<boolean>({
    url: API.checkPassword,
    data,
  });
};

/**
 * @description: 更新密码
 */
export const updatePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request.put<System.User>({
    url: API.updatePassword,
    data,
  });
};
