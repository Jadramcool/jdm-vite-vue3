import { usePermissionStore } from '@/store';
import type { Directive, DirectiveBinding } from 'vue';

export const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding): void {
    const permissionStore = usePermissionStore();
    const { value } = binding;

    if (!value) return;
    const curBtnList = permissionStore.getButtonPermissionKeys;
    if (!curBtnList.includes(value)) el.style.display = 'none';
    else el.style.display = 'auto';
  },
};
