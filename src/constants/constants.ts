import { $t } from '@/locales/i18n';
import { MENU_TYPE, NOTICE_TYPE } from '@/utils';

/** @description: 菜单类型 */
export const MenuTypeOptions = computed(() => [
  { label: $t('modules.system.menu.typeMap.directory'), value: MENU_TYPE.DIRECTORY },
  { label: $t('modules.system.menu.typeMap.menu'), value: MENU_TYPE.MENU },
  { label: $t('modules.system.menu.typeMap.button'), value: MENU_TYPE.BUTTON },
]);

/** @description: 页面布局 */
export const layoutOptions = computed(() => [
  { label: $t('layout.normal'), value: 'normal' },
  // { label: $t('layout.normalWithOutCard'), value: 'normal-without-card' },
]);

/** @description: 菜单类型主题 */
export const MenuTypeColorMap: Record<string, 'success' | 'warning' | 'info'> = {
  [MENU_TYPE.DIRECTORY]: 'success',
  [MENU_TYPE.MENU]: 'warning',
  [MENU_TYPE.BUTTON]: 'info',
};

/** @description: 状态选项配置 */
export const statusOptions = computed(() => [
  { label: $t('user.status.enable'), value: 1 },
  { label: $t('user.status.disable'), value: 0 },
]);

/** @description: 公告类型主题 */
export const NoticeTypeColorMap: Record<string, 'success' | 'warning' | 'info'> = {
  [NOTICE_TYPE.INFO]: 'success',
  [NOTICE_TYPE.NOTICE]: 'info',
  [NOTICE_TYPE.ACTIVITY]: 'warning',
};

/** @description: 公告类型配置 */
export const NoticeTypeOptions = computed(() => [
  { label: $t('modules.notice.notice.typeMap.notice'), value: 'NOTICE' },
  { label: $t('modules.notice.notice.typeMap.info'), value: 'INFO' },
  { label: $t('modules.notice.notice.typeMap.activity'), value: 'ACTIVITY' },
]);
