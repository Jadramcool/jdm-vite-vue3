export default {
  table: {
    apiSetting: {
      // 当前页的字段名
      pageField: 'current',
      // 每页数量字段名
      sizeField: 'size',
      // 接口返回的数据字段名
      listField: 'records',
      // 接口返回总页数字段名
      totalField: 'pages',
      // 接口返回总数据个数
      itemCountField: 'total',
    },
    // 默认分页数量
    defaultPageSize: 10,
    // 可切换每页数量集合
    pageSizes: [5, 10, 20, 30, 40],
  },
};
