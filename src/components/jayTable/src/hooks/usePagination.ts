import { isBoolean } from '@/utils/common';
import { APISETTING, DEFAULTPAGESIZE, PAGESIZES } from '../const';

export const usePagination = (refProps: any) => {
  const configRef = ref({});
  console.log('🚀 ~ usePagination ~ configRef:', configRef.value);
  const show = ref<boolean>(true);

  const getPaginationInfo = computed(() => {
    // 从父传子值中查看是否开启了分页
    const { pagination } = unref(refProps);
    if (!unref(show) || (isBoolean(pagination) && !pagination)) {
      console.log(1);
      // 未开启，直接返回false
      return false;
    }
    // 获取接口返回总页数字段名
    const { totalField, itemCountField } = APISETTING;
    return {
      pageSize: DEFAULTPAGESIZE, // 默认每页数量
      pageSizes: PAGESIZES, // 默认可切换每页数量
      showSizePicker: true,
      showQuickJumper: true,
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
      pageCount: unref(configRef)[totalField],
      itemCount: unref(configRef)[itemCountField] || 0,
    };
  });

  return { getPaginationInfo };
};
