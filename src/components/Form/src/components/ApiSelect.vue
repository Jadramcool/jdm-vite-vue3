<template>
  <n-select
    v-model:value="modelValue"
    :options="options"
    :multiple="multiple"
    :filterable="filterable"
  />
</template>

<script setup lang="ts">
import { get, isEqual } from 'lodash';
import type { SelectOption } from 'naive-ui';
import { computed, readonly, ref, unref, watch, type PropType } from 'vue';

defineOptions({ name: 'ApiSelect' });

// 定义双向绑定的值
const modelValue = defineModel<any>('value');
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
  // 是否自动加载数据
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
  filterable: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const getProps = computed(() => {
  return { ...unref(props) };
});

const apiMethod = computed(() => {
  return unref(getProps).api;
});

const options: any = ref([]);

/**
 * 获取选项数据
 * @param value 请求参数
 * @param force 是否强制加载，忽略autoLoad设置
 */
const fetch = async (value: Recordable = {}, force = false) => {
  // 如果没有API方法，直接返回
  if (!unref(apiMethod)) {
    return;
  }

  // 如果不是强制加载且autoLoad为false，直接返回
  if (!force && !unref(getProps).autoLoad) {
    return;
  }

  options.value = [];
  if (unref(apiMethod)) {
    try {
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
    } catch (error) {
      console.error('ApiSelect fetch error:', error);
      options.value = [];
    }
  }
};

// 监听参数变化，自动加载数据
watch(
  () => props.params,
  (value, oldValue) => {
    if (isEqual(value, oldValue)) return;
    // 只有在autoLoad为true时才自动加载
    if (unref(getProps).autoLoad) {
      fetch(value);
    }
  },
  { deep: true, immediate: props.immediate && props.autoLoad },
);

/**
 * 手动加载数据
 * @param params 可选的请求参数，如果不传则使用props.params
 */
const loadData = async (params?: Recordable) => {
  await fetch(params || props.params, true); // 强制加载
};

/**
 * 清空选项数据
 */
const clearOptions = () => {
  options.value = [];
};

// 暴露方法给父组件
defineExpose({
  loadData,
  clearOptions,
  options: readonly(options),
});

// TODO: 搜索参数功能待实现
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
