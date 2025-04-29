/*
 * @Author: Jay
 * @Date: 2024-05-30 13:50:03
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-31 10:25:52
 * @FilePath: \vite-vue3-jdm\src\components\Table\src\hooks\useDataSource.ts
 * @Description: 表格数据获取
 *
 */
import { isBoolean } from '@/utils/common';
import { APISETTING } from '../const';

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

interface TableProps {
  request?: (params: any) => Promise<any>;
  pagination?: boolean | Record<string, any>;
  filters?: Record<string, any>;
  localPagination?: boolean;
  autoLoad?: boolean;
}

interface PaginationHooks {
  getPaginationInfo: ComputedRef<any>;
  setPagination: (info: Record<string, any>) => void;
  setLoading: (status: boolean) => void;
}

export const useDataSource = (
  propsRef: TableProps,
  { getPaginationInfo, setPagination, setLoading }: PaginationHooks,
) => {
  // 存储完整的数据源
  const fullDataSourceRef = ref<any[]>([]);
  const dataSourceRef: Recordable = ref([]);

  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef);
    }
    return unref(dataSourceRef);
  });

  // 处理本地分页
  const handleLocalPagination = (data: any[]) => {
    const pagination = unref(getPaginationInfo);
    if (!pagination) return data;

    const { page = 1, pageSize = 10 } = pagination;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    // 设置分页信息
    setPagination({
      [pageField]: page,
      [totalField]: Math.ceil(data.length / pageSize),
      [itemCountField]: data.length,
    });
    return data.slice(start, end);
  };

  const { pageField, sizeField, totalField, itemCountField } = APISETTING;

  async function fetch(opt: any) {
    try {
      // 显示加载动画
      setLoading(true);
      const { request, pagination, filters, localPagination } = unref(propsRef);
      if (!request) return;

      // 分页信息, 分页字段名，每页数量字段名，总页数字段名，总数据个数字段名
      let pageParams: any = {};
      // 分页参数，当前页以及每页数量
      const { page = 1, pageSize = 10 } = unref(getPaginationInfo);

      // 判断是否使用本地分页
      if (localPagination === true) {
        const params = {
          pagination: {
            page: 1,
            pageSize: 999,
          },
          ...toRaw(filters),
        };
        // 获取所有数据
        const res: any = await request(params);

        fullDataSourceRef.value = res?.data || res || [];
        // 处理本地分页
        dataSourceRef.value = handleLocalPagination(fullDataSourceRef.value);
      } else {
        // 远程分页
        // 额外请求参数
        const options: any = {};

        if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
          // 没有开启分页
          pageParams = {};
          options.showPagination = false; // 关闭分页
        } else {
          // page，即当前页，如果opt参数中有的话，从opt中赋值/
          pageParams[pageField] = (opt && opt[pageField]) || page;
          pageParams[sizeField] = pageSize;
        }
        const params = {
          pagination: pageParams,
          options,
          ...toRaw(filters),
        };
        const res: any = await request(params);
        dataSourceRef.value = res?.data || res || [];
        // 设置分页信息
        const pageInfo = res.pagination || {};
        if (pageInfo) {
          // 从结果中拿到总页数，缺省值为0。
          const resultTotal = pageInfo[totalField] || 0;
          // 从结果中拿到当前页
          const currentPage = pageInfo[pageField];
          // 从结果拿到总数据数
          const totalData = pageInfo[itemCountField];

          // 赋予分页信息
          setPagination({
            [pageField]: currentPage,
            [totalField]: resultTotal,
            [itemCountField]: totalData,
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      // 不论成功与否，隐藏加载动画
      setLoading(false);
    }
  }

  onMounted(() => {
    if (unref(propsRef).autoLoad) {
      setTimeout(() => {
        fetch({});
      }, 16);
    }
  });

  // 获取表格数据
  function getDataSource() {
    return getDataSourceRef.value;
  }

  async function reload(opt: any = {}) {
    await fetch(opt);
  }
  return {
    dataSourceRef,
    getDataSourceRef,
    getDataSource,
    fetch,
    reload,
    handleLocalPagination, // 暴露本地分页方法
    fullDataSourceRef, // 暴露完整数据源
  };
};
