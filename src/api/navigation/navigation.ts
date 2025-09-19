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
  websiteInfo = '/navigation/website-info',
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
 * @description: 禁用导航
 */
export const disable = (id: number) => {
  return request.put<Navigation.Navigation>({
    url: `${API.update}`,
    data: {
      id,
      status: 0,
    },
  });
};

/**
 * @description: 启用导航
 */
export const enable = (id: number) => {
  return request.put<Navigation.Navigation>({
    url: `${API.update}`,
    data: {
      id,
      status: 1,
    },
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
export const updateNavigationGroup = (data: any) => {
  return request.put<Navigation.NavigationGroup>({
    url: API.groupUpdate,
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

/**
 * @description: 获取网站信息
 */
export const websiteInfo = (params: { url: string }) => {
  return request.get<Navigation.WebsiteInfo>({
    url: API.websiteInfo,
    params,
  });
};
