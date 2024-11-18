<template>
  <n-tree-select
    v-bind="getBindValue"
    :options="options"
    v-model:value="modelValue"
    :loading="loading"
    :on-focus="onFocus"
  />
</template>

<script setup lang="ts">
import { isEqual } from 'lodash';
import type { TreeSelectOption } from 'naive-ui';
import { NTreeSelect } from 'naive-ui';

defineOptions({ name: 'ApiTreeSelect' });

const modelValue: any = defineModel('value');
// type ApiSearchOption = {
//   // 展示搜索
//   show?: boolean;
//   // 待搜索字段名
//   searchName?: string;
//   // 是否允许空搜索
//   emptySearch?: boolean;
//   // 搜索前置方法
//   beforeFetch?: (value?: string) => Promise<string>;
//   // 拦截方法
//   interceptFetch?: (value?: string) => Promise<boolean>;
// };

const props = defineProps({
  ...NTreeSelect.props,
  value: {
    type: [Array, Object, String, Number] as PropType<
      Array<string | number> | string | number | null
    >,
  },
  api: {
    type: Function as PropType<(arg?: any) => Promise<any[] | Recordable>>,
    default: null,
  },
  // TODO  请求参数
  params: {
    type: Object as PropType<Recordable>,
    default: () => ({}),
  },
  // TODO  搜索参数
  searchParams: {
    type: Object as PropType<Recordable>,
    default: () => ({}),
  },
  //   选项字段
  labelField: {
    type: String as PropType<string>,
    default: 'label',
  },
  //   值字段
  keyField: {
    type: String as PropType<string>,
    default: 'id',
  },
  //   autoLoad 是否自动加载
  autoLoad: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  afterRequest: {
    type: Function as PropType<(res: any) => any>,
    default: null,
  },
  clearable: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  showPath: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
});

const loading = ref<boolean>(false);

const getProps = computed(() => {
  return { ...unref(props) };
});

const apiMethod = computed(() => {
  return unref(getProps).api;
});

const getBindValue = computed(() => {
  return { ...unref(getProps) };
});
// 树选项列表
const options = ref<TreeSelectOption[]>([]);

onMounted(() => {
  if (unref(getProps).autoLoad) {
    fetch();
  }
});

const onFocus = () => {
  if (!unref(getProps).autoLoad) {
    fetch();
  }
};

// 转换函数
// const transferOptions = (data: any[]): TreeSelectOption[] => {
//   return data.map((item) => {
//     const transformedItem: TreeSelectOption = {
//       label: item[unref(getProps).labelField], // 原始数据的 转换为 label
//       key: item[unref(getProps).keyField], // 原始数据的 转换为 key
//     };

//     // 只在存在 children 且 children 非空时添加 children 字段
//     if (item.children && item.children.length > 0) {
//       transformedItem.children = transferOptions(item.children); // 递归转换 children
//     }

//     return transformedItem;
//   });
// };

// 加载数据
const fetch = async () => {
  try {
    if (unref(apiMethod)) {
      loading.value = true;
      const res = await unref(apiMethod)();

      const data = Array.isArray(res) ? res : res.data;
      let optionData: any = data;

      // 后处理
      if (unref(getProps).afterRequest) {
        optionData = unref(getProps).afterRequest(data);
      }

      // options.value = transferOptions(optionData);
      options.value = optionData;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.params,
  (value, oldValue) => {
    if (isEqual(value, oldValue)) return;
    fetch();
  },
  { deep: true },
);
</script>
