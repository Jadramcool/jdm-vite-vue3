import request from '@/utils/http/axios';
import { BasicModel } from '../types/base';

enum API {
  permission = '/system/permission/menu',
}

/**
 * @description: 获取菜单
 */
export const permissionList = () => {
  return request.get<BasicModel[]>({
    url: API.permission,
  });
};
