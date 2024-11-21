import { usePermissionStore } from '@/store';

export const hasPermission = (permission: string) => {
  const permissionStore = usePermissionStore();
  return permissionStore.getButtonPermissionKeys.includes(permission);
};
