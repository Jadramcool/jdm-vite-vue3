<template>
  <n-select :options="options" v-model:value="modelValue" :multiple="multiple" />
</template>

<script setup lang="ts">
import { isEmpty, isEqual } from 'lodash';
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
  //   autoLoad 是否自动加载
  autoLoad: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  //   autoLoad 是否自动加载
  immediate: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const { api, labelField, valueField, searchParams } = props;

const options: any = ref([]);

const fetch = async () => {
  if (api) {
    const res = await api();

    const data = Array.isArray(res) ? res : res.data;
    options.value.push(
      ...data.map((item: Recordable) => ({
        label: item[labelField],
        value: item[valueField],
      })),
    );
  }
};

watch(
  () => props.params,
  (value, oldValue) => {
    if (isEqual(value, oldValue)) return;
    fetch();
  },
  { deep: true, immediate: props.immediate },
);

// TODO 这个还没做
watch(
  () => searchParams.value,
  (value, oldValue) => {
    if (isEmpty(value) || isEqual(value, oldValue)) return;
    (async () => {
      await fetch();
      searchParams.value = {};
    })();
  },
  { deep: true, immediate: props.immediate },
);
</script>
