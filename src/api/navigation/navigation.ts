import request from '@/utils/http/axios';
import { List } from '../types';

enum API {
  list = '/navigation/list',
  detail = '/navigation/detail',
  create = '/navigation/create',
  update = '/navigation/update',
  delete = '/navigation/delete',
  group = '/navigation-group/list',
  groupCreate = '/navigation-group/create',
  groupUpdate = '/navigation-group/update',
  groupDelete = '/navigation-group/delete',
}

/**
 * @description: 获取导航
 */
export const navigationList = (params?: any) => {
  return request.get<List<Navigation.Navigation>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 获取导航详细信息
 */
export const navigationDetail = (navigationId: number) => {
  return request.get<Navigation.Navigation>({
    url: `${API.detail}/${navigationId}`,
  });
};

/**
 * @description: 获取导航分组
 */
export const getNavigationGroup = (params?: any) => {
  return request.get<List<Navigation.NavigationGroup>>({
    url: API.group,
    params,
  });
};

/**
 * @description: 创建导航
 */
export const createNavigation = (data: any) => {
  return request.post<Navigation.Navigation>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新导航
 */
export const updateNavigation = (data: any) => {
  return request.put<Navigation.Navigation>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除导航
 */
export const deleteNavigation = (id: number) => {
  return request.delete<Navigation.Navigation>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 创建导航分组
 */
export const createNavigationGroup = (data: any) => {
  return request.post<Navigation.NavigationGroup>({
    url: API.groupCreate,
    data,
  });
};

/**
 * @description: 更新导航分组
 */
export const updateNavigationGroup = (id: number, data: any) => {
  return request.put<Navigation.NavigationGroup>({
    url: `${API.groupUpdate}/${id}`,
    data,
  });
};

/**
 * @description: 删除导航分组
 */
export const deleteNavigationGroup = (id: number) => {
  return request.delete<Navigation.NavigationGroup>({
    url: `${API.groupDelete}/${id}`,
  });
};
