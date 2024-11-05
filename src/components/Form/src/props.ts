/*
 * @Author: jdm
 * @Date: 2024-05-30 10:29:46
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-29 11:20:06
 * @FilePath: \vite-vue3-jdm\src\components\Form\src\props.ts
 * @Description:
 *
 */
import type { GridItemProps, GridProps } from 'naive-ui';
import { NForm } from 'naive-ui';
import type { PropType } from 'vue';

export const basicProps = {
  ...NForm.props,
  labelWidth: {
    type: [Number, String],
    default: 'auto',
  },
  // 必填星号的位置
  requireMarkPlacement: {
    type: String,
    default: 'left',
  },
  // 表单配置规则
  schemas: {
    type: [Array],
    default: () => [],
  },
  // 布局方式
  layout: {
    type: String,
    default: 'inline',
  },
  // 是否显示行为内表单
  inline: {
    type: Boolean,
    default: false,
  },
  // 大小
  size: {
    type: String,
    default: 'medium',
  },
  // 标签文本对齐方式
  labelAlign: {
    type: String,
    default: 'right',
  },
  // 标签位置
  labelPlacement: {
    type: String,
    default: 'left',
  },
  // 组件是否width 100%
  isFull: {
    type: Boolean,
    default: true,
  },
  // 是否显示操作按钮（查询/重置）
  showActionButtonGroup: {
    default: true,
  },
  // 显示重置按钮
  showResetButton: {
    default: true,
  },
  // 重置按钮配置
  resetButtonOptions: Object,
  // 显示确认按钮
  showSubmitButton: {
    default: true,
  },
  // 确认按钮配置
  submitButtonOptions: Object,
  // 展开收起按钮
  showAdvancedButton: {
    default: true,
  },
  // 确认按钮文字
  submitButtonText: {
    type: String,
    default: '查询',
  },
  // 重置按钮文字
  resetButtonText: {
    type: String,
    default: '重置',
  },
  // grid 配置
  gridProps: {
    type: Object as PropType<GridProps>,
    default: () => ({
      'x-gap': 10,
    }),
  },
  // gi配置
  giProps: {
    type: Object as PropType<GridItemProps>,
    default: () => ({
      offset: 1,
    }),
  },
  // grid 样式
  baseGridStyle: {
    type: Object,
  },
  // 是否折叠
  collapsed: {
    type: Boolean,
    default: false,
  },
  // 默认展示的行数
  collapsedRows: {
    type: Number,
    default: 1,
  },
};
