import request from '@/utils/http/axios';

enum API {
  sort = '/public/sort',
  resetSort = '/public/resetSort',
}

/**
 * @description: 排序
 */
export const sort = (data: any) => {
  return request.post<any>({
    url: API.sort,
    data,
  });
};

/**
 * @description: 重置排序
 */
export const resetSort = (data: any) => {
  return request.post<any>({
    url: API.resetSort,
    data,
  });
};
