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
  title: {
    type: String,
    default: null,
  },
  //   titleTooltip: {
  //     type: String,
  //     default: null,
  //   },
  //   dataSource: {
  //     type: [Object],
  //     default: () => [],
  //   },
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
  // 废弃，用pagination替代
  // showPagination: {
  //   type: [String, Boolean],
  //   default: 'auto',
  // },
  //   actionColumn: {
  //     type: Object,
  //     default: null,
  //   },
  //   canResize: {
  //     type: Boolean,
  //     default: true,
  //   },
  //   resizeHeightOffset: {
  //     type: Number,
  //     default: 0,
  //   },
};
