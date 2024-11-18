import { $t } from '@/locales/i18n';
import { MENU_TYPE } from '@/utils';

/** @description: 菜单类型 */
export const MenuTypeOptions = computed(() => [
  { label: $t('modules.system.menu.typeMap.directory'), value: MENU_TYPE.DIRECTORY },
  { label: $t('modules.system.menu.typeMap.menu'), value: MENU_TYPE.MENU },
  { label: $t('modules.system.menu.typeMap.button'), value: MENU_TYPE.BUTTON },
]);

/** @description: 页面布局 */
export const layoutOptions = computed(() => [{ label: $t('layout.normal'), value: 'normal' }]);

/** @description: 菜单类型主题 */
export const MenuTypeColorMap: Record<string, string> = {
  [MENU_TYPE.DIRECTORY]: 'success',
  [MENU_TYPE.MENU]: 'warning',
  [MENU_TYPE.BUTTON]: 'info',
};
