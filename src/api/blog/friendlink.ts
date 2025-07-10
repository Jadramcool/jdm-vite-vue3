import request from '@/utils/http/axios';

enum API {
  // 友链基础操作 - 使用RESTful设计
  friendlinks = '/blog/friendlink', // GET: 获取友链列表, POST: 创建友链
  approvedFriendLinks = '/blog/friendlink/approved', // GET: 获取已审核友链
  friendlinkStats = '/blog/friendlink/stats', // GET: 获取友链统计
  friendlinkById = '/blog/friendlink/:id', // GET: 获取友链, PUT: 更新友链, DELETE: 删除友链
  approveFriendLink = '/blog/friendlink/:id/approve', // PUT: 审核通过友链
  rejectFriendLink = '/blog/friendlink/:id/reject', // PUT: 拒绝友链
  updateFriendLinkSort = '/blog/friendlink/sort', // PUT: 更新友链排序
}

/**
 * @description: 创建友情链接
 */
export const createFriendLink = (data: Blog.CreateFriendLinkRequest) => {
  return request.post<Blog.FriendLink>({
    url: API.friendlinks,
    data,
  });
};

/**
 * @description: 获取友情链接列表
 */
export const getFriendLinkList = (params?: any) => {
  return request.get<Blog.FriendLinkListResponse>({
    url: API.friendlinks,
    params,
  });
};

/**
 * @description: 获取已审核通过的友情链接
 */
export const getApprovedFriendLinks = (params?: any) => {
  return request.get<Blog.FriendLink[]>({
    url: API.approvedFriendLinks,
    params,
  });
};

/**
 * @description: 获取友情链接统计
 */
export const getFriendLinkStats = () => {
  return request.get<Blog.FriendLinkStatsResponse>({
    url: API.friendlinkStats,
  });
};

/**
 * @description: 根据ID获取友情链接
 */
export const getFriendLinkById = (id: number) => {
  return request.get<Blog.FriendLink>({
    url: API.friendlinkById.replace(':id', id.toString()),
  });
};

/**
 * @description: 更新友情链接
 */
export const updateFriendLink = (id: number, data: Blog.UpdateFriendLinkRequest) => {
  return request.put<Blog.FriendLink>({
    url: API.friendlinkById.replace(':id', id.toString()),
    data,
  });
};

/**
 * @description: 删除友情链接
 */
export const deleteFriendLink = (id: number) => {
  return request.delete<void>({
    url: API.friendlinkById.replace(':id', id.toString()),
  });
};

/**
 * @description: 审核通过友情链接
 */
export const approveFriendLink = (id: number) => {
  return request.put<Blog.FriendLink>({
    url: API.approveFriendLink.replace(':id', id.toString()),
  });
};

/**
 * @description: 拒绝友情链接
 */
export const rejectFriendLink = (id: number) => {
  return request.put<Blog.FriendLink>({
    url: API.rejectFriendLink.replace(':id', id.toString()),
  });
};

/**
 * @description: 更新友情链接排序
 */
export const updateFriendLinkSort = (data: {
  friendLinks: Array<{ id: number; sortOrder: number }>;
}) => {
  return request.put<Blog.FriendLink[]>({
    url: API.updateFriendLinkSort,
    data,
  });
};
