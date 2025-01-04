import request from '@/utils/http/axios';
import { List } from '../types';

enum API {
  list = '/appointment/list',
  registered = '/appointment/registered',
  cancel = '/appointment/cancel',
  call = '/appointment/call',
  finish = '/appointment/finish',
  doctorAppointmentList = '/appointment/doctorAppointmentList',
  detail = '/appointment/detail',
}

/**
 * @description: 获取挂号列表
 */
export const list = (params: any) => {
  return request.get<List<Appointment.Appointment>>({
    url: API.list,
    params,
  });
};

/**
 * @description: 挂号
 */
export const registered = (data: any) => {
  return request.post<Appointment.Appointment>({
    url: API.registered,
    data,
  });
};

/**
 * @description: 取消挂号
 */
export const cancel = (appointmentId: number) => {
  return request.post<Appointment.Appointment>({
    url: `${API.cancel}/${appointmentId}`,
  });
};

/**
 * @description: 医生当日当前时间段挂号列表
 */
export const doctorAppointmentList = (params?: any) => {
  return request.get<Appointment.Appointment>({
    url: API.doctorAppointmentList,
    params,
  });
};

/**
 * @description: 叫号
 */
export const call = (appointmentId: number) => {
  return request.post<Appointment.Appointment>({
    url: `${API.call}/${appointmentId}`,
  });
};

/**
 * @description: 叫号
 */
export const finish = (appointmentId: number) => {
  return request.post<Appointment.Appointment>({
    url: `${API.finish}/${appointmentId}`,
  });
};

/**
 * @description: 挂号详情-包括病历啥的
 */
export const detail = (appointmentId: number) => {
  return request.get<Appointment.Appointment>({
    url: `${API.detail}/${appointmentId}`,
  });
};
