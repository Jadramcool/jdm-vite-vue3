<template>
  <n-date-picker v-bind="getBindValue" :type="props.type" v-model:value="modelValue" />
</template>

<script setup lang="ts">
defineOptions({ name: 'DatePicker' });

type DatePickerType =
  | 'date'
  | 'datetime'
  | 'daterange'
  | 'datetimerange'
  | 'month'
  | 'monthrange'
  | 'year'
  | 'yearrange'
  | 'quarter'
  | 'quarterrange'
  | 'week';

const modelValue: any = defineModel('value');

const attrs = useAttrs();
const props = defineProps({
  type: {
    type: String as () => DatePickerType,
    default: 'date',
  },
  placeholder: {
    type: String,
    default: '',
  },
  defaultValue: {
    default: null,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  shortcuts: {
    type: Object,
    default: () => {},
  },
  // 格式化日期
  format: {
    type: String,
    default: undefined,
  },
  now: {
    type: Boolean,
    default: true,
  },
  // ____以下为新增属性____
  // 是否显示默认快捷键
  showDefaultShortcuts: {
    type: Boolean,
    default: false,
  },
});

const defaultShortcuts = reactive({
  今天: () => new Date(),
  昨天: () => new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  一周前: () => new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
  一个月前: () => new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
  三个月前: () => new Date(new Date().getTime() - 3 * 30 * 24 * 60 * 60 * 1000),
  一年前: () => new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
});

const defaultRangeShortcuts = reactive({
  最近7天: () => [new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), new Date()],
  最近30天: () => [new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), new Date()],
  最近3个月: () => [new Date(new Date().getTime() - 3 * 30 * 24 * 60 * 60 * 1000), new Date()],
  最近6个月: () => [new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000), new Date()],
  最近1年: () => [new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000), new Date()],
});

const getProps = computed(() => {
  const newProps = { ...unref(props) };

  // 设置自定义快捷键
  newProps.shortcuts = {
    ...(newProps.showDefaultShortcuts
      ? newProps.type.includes('range')
        ? defaultRangeShortcuts
        : defaultShortcuts
      : {}),
    ...(newProps.shortcuts || {}),
  };

  return {
    ...newProps,
  };
});

const getBindValue = computed(() => {
  return { ...attrs, ...getProps.value };
});

// watch(
//   () => unref(modelValue),
//   (val) => {
//     modelValue.value = dayjs(val).valueOf() || val;
//   },
// );
</script>
