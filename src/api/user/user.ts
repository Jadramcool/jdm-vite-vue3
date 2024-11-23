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
  return request.post<BasicModel[]>({
    url: API.login,
    data,
  });
};

/**
 * @description: 注册
 * @param {loginModel} data
 */
export const register = (data: System.loginModel) => {
  return request.post<BasicModel[]>({
    url: API.register,
    data,
  });
};

/**
 * @description: 获取用户信息
 */
export const getUserInfo = () => {
  return request.get<BasicModel[]>({
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
export const update = (data: any) => {
  return request.put<BasicModel[]>({
    url: API.update,
    data,
  });
};

/**
 * @description: 检查密码
 */
export const checkPassword = (data: any) => {
  return request.post<BasicModel[]>({
    url: API.checkPassword,
    data,
  });
};

/**
 * @description: 更新密码
 */
export const updatePassword = (data: any) => {
  return request.put<BasicModel[]>({
    url: API.updatePassword,
    data,
  });
};
