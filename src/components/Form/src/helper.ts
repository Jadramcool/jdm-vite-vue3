/*
 * @Author: jdm
 * @Date: 2024-10-29 10:14:49
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-29 10:32:14
 * @FilePath: \vite-vue3-jdm\src\components\Form\src\helper.ts
 * @Description:
 *
 */
import { ComponentType } from './types/index';

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType | undefined) {
  if (!component) return '';
  if (component === 'NInput') return '请输入';
  if (
    ['NPicker', 'NSelect', 'NCheckbox', 'NRadio', 'NSwitch', 'NDatePicker', 'NTimePicker'].includes(
      component,
    )
  )
    return '请选择';
  return '';
}
