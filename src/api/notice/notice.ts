import request from '@/utils/http/axios';
import { List } from '../types';

enum API {
  list = '/notice/list',
  detail = '/notice/detail',
  create = '/notice/create',
  update = '/notice/update',
  delete = '/notice/delete',
  send = '/notice/send',
  userNotice = '/notice/userNotice',
  read = '/notice/read',
}

/**
 * @description: 获取公告
 */
export const noticeList = (params?: any) => {
  return request.get<List<Notice.Notice>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 获取公告详细信息
 */
export const noticeDetail = (noticeId: number) => {
  return request.get<Notice.Notice>({
    url: `${API.detail}/${noticeId}`,
  });
};

/**
 * @description: 创建公告
 */
export const createNotice = (data: any) => {
  return request.post<Notice.Notice>({
    url: API.create,
    data,
  });
};

/**
 * @description: 更新公告
 */
export const updateNotice = (data: any) => {
  return request.put<Notice.Notice>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除公告
 */
export const deleteNotice = (id: number) => {
  return request.delete<Notice.Notice>({
    url: `${API.delete}/${id}`,
  });
};

/**
 * @description: 发送公告
 */
export const sendNotice = (data: { id: number; userIds: number[] }) => {
  return request.post<Notice.Notice>({
    url: API.send,
    data,
  });
};

/**
 * @description: 用户公告
 */
export const getUserNotice = (params?: any) => {
  return request.get<List<Notice.UserNotice>>({
    url: API.userNotice,
    params,
  });
};

/**
 * @description: 用户阅读公告
 */
export const updateUserNoticeRead = (data: any) => {
  return request.put<number>({
    url: API.read,
    data,
  });
};
