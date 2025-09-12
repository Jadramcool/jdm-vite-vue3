import { $t } from '@/locales/i18n';
/** @description 操作状态样式配置 */
export const operationStatusColorOptions: Record<string, 'success' | 'error' | 'warning'> = {
  SUCCESS: 'success',
  FAILED: 'error',
  PENDING: 'warning',
};
/** @description 操作类型选项配置 */
export const operationTypeOptions = computed(() => [
  { label: $t('modules.system.opLog.operationTypeMap.create'), value: 'CREATE' },
  { label: $t('modules.system.opLog.operationTypeMap.update'), value: 'UPDATE' },
  { label: $t('modules.system.opLog.operationTypeMap.delete'), value: 'DELETE' },
  { label: $t('modules.system.opLog.operationTypeMap.view'), value: 'VIEW' },
  { label: $t('modules.system.opLog.operationTypeMap.login'), value: 'LOGIN' },
  { label: $t('modules.system.opLog.operationTypeMap.logout'), value: 'LOGOUT' },
  { label: $t('modules.system.opLog.operationTypeMap.export'), value: 'EXPORT' },
  { label: $t('modules.system.opLog.operationTypeMap.import'), value: 'IMPORT' },
  { label: $t('modules.system.opLog.operationTypeMap.other'), value: 'OTHER' },
]);

/** @description 操作状态选项配置 */
export const operationStatusOptions = computed(() => [
  { label: $t('modules.system.opLog.operationStatusMap.success'), value: 'SUCCESS' },
  { label: $t('modules.system.opLog.operationStatusMap.failed'), value: 'FAILED' },
  { label: $t('modules.system.opLog.operationStatusMap.pending'), value: 'PENDING' },
]);
