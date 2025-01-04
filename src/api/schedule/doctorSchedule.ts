import request from '@/utils/http/axios';
import { List } from '../types';

enum API {
  list = '/schedule/doctorSchedule/list',
  create = '/schedule/doctorSchedule/create',
  updateByDate = '/schedule/doctorSchedule/updateByDate',
  update = '/schedule/doctorSchedule/update',
  delete = '/schedule/doctorSchedule/delete',
  detail = '/schedule/doctorSchedule/detail',
  current = '/schedule/doctorSchedule/current',
}

/**
 * @description: 获取排班列表
 */
export const list = (params?: any) => {
  return request.get<List<Schedule.DoctorSchedule>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 创建排班
 */
export const create = (data: any) => {
  return request.post<Schedule.DoctorSchedule>({
    url: API.create,
    data,
  });
};

/**
 * @description: 创建排班
 */
export const updateByDate = (data: any) => {
  return request.post<Schedule.DoctorSchedule>({
    url: API.updateByDate,
    data,
  });
};

/**
 * @description: 更新排班
 */
export const update = (data: any) => {
  return request.put<Schedule.DoctorSchedule>({
    url: API.update,
    data,
  });
};

/**
 * @description: 删除排班
 */
export const deleteSchedule = (id: number) => {
  return request.delete<Schedule.DoctorSchedule>({
    url: `${API.delete}/${id}`,
  });
};

export const detail = (id: number) => {
  return request.get<Schedule.DoctorSchedule>({
    url: `${API.detail}/${id}`,
  });
};
/**
 * @description: 获取当前时间的排班
 */
export const current = (params?: any) => {
  return request.get<Schedule.DoctorSchedule>({
    url: API.current,
    params,
  });
};
