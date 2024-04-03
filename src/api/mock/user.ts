import request from '@/utils/http/baseAxios';

export function login(data: any) {
  return request.post('/api/createUser', data);
}
