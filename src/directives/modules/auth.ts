import { usePermissionStore } from '@/store';
import type { Directive, DirectiveBinding } from 'vue';

/**
 * v-auth 权限指令
 * 根据用户权限控制元素显示/隐藏
 *
 * @example
 * <n-button v-auth="'user:add'">新增</n-button>
 */
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
