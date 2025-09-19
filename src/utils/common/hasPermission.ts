import { usePermissionStore, useUserStore } from '@/store';

export const hasPermission = (permission: string) => {
  const permissionStore = usePermissionStore();
  return permissionStore.getButtonPermissionKeys.includes(permission);
};

/**
 * 判断当前用户是否为管理员
 * @returns 如果是管理员返回true，否则返回false
 */
export const isAdmin = (): boolean => {
  const userStore = useUserStore();
  const { userInfo } = userStore;
  // return false;
  return userInfo ? userInfo?.roleType === 'admin' : false;
};
