/*
 * @Author: Jay
 * @Date: 2024-05-30 10:29:46
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-30 18:13:18
 * @FilePath: \vite-vue3-jdm\src\components\Table\src\props.ts
 * @Description:
 *
 */
import { NDataTable } from 'naive-ui';

export const basicProps = {
  ...NDataTable.props, // 这里继承原 UI 组件的 props
  // 卡片title,不要跟columns的title混淆,打算getProps的时候将title改成cardTitle
  title: {
    type: String,
    default: undefined,
  },
  columns: {
    type: [Array],
    default: () => [],
    required: true,
  },
  //   beforeRequest: {
  //     type: Function,
  //     default: null,
  //   },
  filters: {
    type: Object,
    default: () => {},
  },
  request: {
    type: Function as PropType<(...arg: any[]) => Promise<any>>,
    default: null,
  },
  //   afterRequest: {
  //     type: Function,
  //     default: null,
  //   },
  rowKey: {
    type: [String, Function],
    default: undefined,
  },
  pagination: {
    type: [Object, Boolean],
    default: () => {},
    // 示例 pagination: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50] }
    // 也可以是 false 关闭分页
  },
  // 是否显示新增按钮
  showAddBtn: {
    type: Boolean,
    default: true,
  },
  // 是否显示批量删除按钮
  showBatchDeleteBtn: {
    type: Boolean,
    default: false,
  },
};
