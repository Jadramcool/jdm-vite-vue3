/*
 * @Author: Jay
 * @Date: 2024-05-30 13:50:03
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-26 17:24:45
 * @FilePath: \vite-vue3-jdm\src\settings\componentSettings.ts
 * @Description:
 *
 */
export default {
  table: {
    apiSetting: {
      // 当前页的字段名
      pageField: 'page',
      // 每页数量字段名
      sizeField: 'pageSize',
      // 接口返回的数据字段名
      listField: 'data',
      // 接口返回总页数字段名
      totalField: 'totalPages',
      // 接口返回总数据个数
      itemCountField: 'totalRecords',
    },
    // 默认分页数量
    defaultPageSize: 10,
    // 可切换每页数量集合
    pageSizes: [5, 10, 20, 30, 40],
    tableLayout: {
      // 表格布局，可选值为 'small' | 'medium' | 'large', 默认为'small'
      size: 'small',
      align: 'center',
      operateType: 'button',
    },
  },
  form: {
    // 表单项默认宽度
  },
};
