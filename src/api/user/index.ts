import request from '@/utils/http/axios';
import { BasicModel } from '../types/base';
import { loginModel } from '../types/user';

enum API {
  login = '/user/login',
  register = '/user/register',
  userInfo = '/user/info',
  permission = '/system/permission/list',
}

/**
 * @description: 登录
 * @param {loginModel} data
 */
export const login = (data: loginModel) => {
  return request.post<BasicModel[]>({
    url: API.login,
    data,
  });
};

/**
 * @description: 注册
 * @param {loginModel} data
 */
export const register = (data: loginModel) => {
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
export const permissionAPI = () => {
  return request.get<BasicModel[]>({
    url: API.permission,
  });
};
