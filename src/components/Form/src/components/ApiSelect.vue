<template>
  <n-select v-model:value="modelValue" :options="options" :multiple="multiple" />
</template>

<script setup lang="ts">
import { get, isEqual } from 'lodash';
import type { SelectOption } from 'naive-ui';

defineOptions({ name: 'ApiSelect' });
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
  value: {
    type: [Array, Object, String, Number] as PropType<
      Array<string | number> | string | number | null
    >,
  },
  api: {
    type: Function as PropType<(arg?: any) => Promise<SelectOption[] | Recordable>>,
    default: null,
  },
  //   请求参数
  params: {
    type: Object as PropType<Recordable>,
    default: () => ({}),
  },
  //   搜索参数
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
  valueField: {
    type: String as PropType<string>,
    default: 'value',
  },
  // TODO   autoLoad 是否自动加载
  autoLoad: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  //   immediate 是否立即
  immediate: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  afterRequest: {
    type: Function as PropType<(res: any) => any>,
    default: null,
  },
});

const getProps = computed(() => {
  return { ...unref(props) };
});

const apiMethod = computed(() => {
  return unref(getProps).api;
});

const options: any = ref([]);

const fetch = async (value: Recordable) => {
  options.value = [];
  if (unref(apiMethod)) {
    const res = await unref(apiMethod)(value);

    const data = Array.isArray(res) ? res : res.data;

    let optionData: any = data;
    if (unref(getProps).afterRequest) {
      optionData = unref(getProps).afterRequest(data);
    }

    options.value = optionData.map((item: Recordable) => ({
      label: get(item, unref(getProps).labelField),
      value: get(item, unref(getProps).valueField),
    }));
  }
};

watch(
  () => props.params,
  (value, oldValue) => {
    if (isEqual(value, oldValue)) return;
    fetch(value);
  },
  { deep: true, immediate: props.immediate },
);

// TODO 这个还没做
// watch(
//   () => unref(getProps).searchParams,
//   (value, oldValue) => {
//     if (isEmpty(value) || isEqual(value, oldValue)) return;
//     (async () => {
//       await fetch(value);
//       unref(getProps).searchParams = {};
//     })();
//   },
//   { deep: true, immediate: props.immediate },
// );
</script>
