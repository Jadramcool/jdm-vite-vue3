import request from '@/utils/http/axios';

enum API {
  userDetail = '/blog/user/detail',
}

/**
 * @description: 获取博客用户信息
 */
export const getBlogUser = () => {
  return request.get<System.User>({
    url: API.userDetail,
  });
};
