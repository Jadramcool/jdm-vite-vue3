import { usePermissionStore } from '@/store';
import type { Directive, DirectiveBinding } from 'vue';

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding): void {
    const permissionStore = usePermissionStore();
    const { value } = binding;

    if (!value) return;
    const curBtnList = permissionStore.getButtonPermissionKeys;
    // 可根据自己的业务修改此处实现逻辑
    if (!curBtnList.includes(value)) el.style.display = 'none';
    else el.style.display = 'auto';
  },
};
