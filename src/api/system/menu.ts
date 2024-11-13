import request from '@/utils/http/axios';
import { BasicModel } from '../types/base';

enum API {
  menu = '/system/menu/list',
}

interface MenuParams extends BasicModel {
  id: number;
  pid: number;
}

/**
 * @description: 获取菜单
 */
export const menuList = (params: any) => {
  return request.get<MenuParams[]>({
    url: API.menu,
    params,
  });
};
