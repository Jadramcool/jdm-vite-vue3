<template>
  <n-flex inline :wrap="false" :size="30" class="w-full">
    <div>
      <VueDatePicker
        inline
        multiDates
        :model-value="date"
        @update:model-value="handleUpdate"
        ref="datepicker"
        :format-locale="zhCN"
        :enable-time-picker="false"
        :min-date="startDate"
        auto-apply
      >
      </VueDatePicker>
    </div>
    <n-scrollbar style="max-height: 450px" class="flex-1">
      <n-list>
        <n-list-item v-for="key in Object.keys(dateWithPeriod)" :key="key">
          <div class="flex-x-center justify-between">
            <div>
              {{ dayjs(key).format('YYYY-MM-DD ddd') }}
            </div>
            <n-checkbox-group
              v-model:value="dateWithPeriod[dayjs(key).format('YYYY-MM-DD')]"
              @update:value="(value: (string | number)[]) => handleUpdateRadio(value, key)"
            >
              <n-space>
                <n-checkbox value="MORNING" label="上午" />
                <n-checkbox value="AFTERNOON" label="下午" />
                <!-- <n-checkbox value="DAY" label="全天" /> -->
              </n-space>
            </n-checkbox-group>
          </div>
        </n-list-item>
      </n-list>
    </n-scrollbar>
  </n-flex>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { zhCN } from 'date-fns/locale';
import dayjs from 'dayjs';
import { get, isEqual } from 'lodash';

const modelValue: any = defineModel('value');

const date = ref<any[]>([]);
const datepicker = ref<any>(null);

const dateWithPeriod = ref<any>({});

const startDate = ref(dayjs().format('YYYY-MM-DD'));
const props = defineProps({
  params: {
    type: Object,
    default: () => {},
  },
  api: {
    type: Function,
    default: null,
  },
  afterRequest: {
    type: Function,
    default: null,
  },
  // 必须要有的参数，才能执行请求接口操作
  requiredParams: {
    type: String,
    default: '',
  },
});

const getProps = computed(() => {
  return {
    ...props,
  };
});

const apiMethod = computed(() => {
  return unref(getProps).api;
});

watch(
  () => props.params,
  (value, oldValue) => {
    if (isEqual(unref(value), unref(oldValue))) return;

    if (unref(getProps).requiredParams && get(unref(value), unref(getProps).requiredParams))
      fetch(unref(value));
  },
  { deep: true },
);

const fetch = async (value: Recordable) => {
  if (unref(apiMethod)) {
    const res = await unref(apiMethod)(value);

    const data = Array.isArray(res) ? res : res.data;
    let resultData: any = data;
    if (unref(getProps).afterRequest) {
      resultData = unref(getProps).afterRequest(data);
    }
    dateWithPeriod.value = {};

    const selectedDate = [
      ...resultData.map((item: Recordable) => {
        const day = dayjs(item.date).format('YYYY-MM-DD');
        const dayKey = day;

        if (dayjs(startDate.value).isSameOrBefore(dayjs(day), 'day')) {
          if (!Array.isArray(dateWithPeriod.value[dayKey])) {
            dateWithPeriod.value[dayKey] = [];
          }
          dateWithPeriod.value[dayKey].push(item.timePeriod);
        }

        return day;
      }),
    ];
    console.log(' dateWithPeriod.value', dateWithPeriod.value);

    date.value = [...selectedDate];
    modelValue.value = Object.entries(dateWithPeriod.value).map(([key, value]) => {
      return {
        date: key,
        timePeriod: value,
      };
    });
    console.log('我走了查询借口');
  }
};
const handleUpdate = (modelData: any) => {
  if (!Array.isArray(modelData)) return;

  // 获取日期并按照升序排序
  const days = modelData.map((item: any) => {
    const day = dayjs(item).format('YYYY-MM-DD');
    if (!dateWithPeriod.value[day]) {
      dateWithPeriod.value[day] = ['MORNING', 'AFTERNOON'];
    }
    return day;
  });

  // 过滤掉不在日期范围内的日期
  const filteredDateWithPeriod = Object.keys(dateWithPeriod.value).reduce(
    (acc, key) => {
      const dateKey = dayjs(key);
      if (days.includes(key) && !dateKey.isBefore(dayjs(startDate.value), 'day')) {
        acc[key] = dateWithPeriod.value[key];
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  // 按时间顺序对 filteredDateWithPeriod 进行排序
  const sortedDateWithPeriod = Object.fromEntries(
    Object.entries(filteredDateWithPeriod).sort(([keyA], [keyB]) => dayjs(keyA).diff(dayjs(keyB))),
  );

  // 更新 date 和 dateWithPeriod
  date.value = days;
  dateWithPeriod.value = sortedDateWithPeriod;
  // 更新 modelValue
  modelValue.value = Object.entries(sortedDateWithPeriod).map(([key, value]) => ({
    date: key,
    timePeriod: value,
  }));
};

// 更新多选时间
const handleUpdateRadio = (value: (string | number)[], date: string) => {
  dateWithPeriod.value[date] = value;
  modelValue.value = Object.entries(dateWithPeriod.value).map(([key, value]) => ({
    date: key,
    timePeriod: value,
  }));
};

// const handleClear = async () => {
//   await datepicker.value.clearValue();
//   date.value = [];
//   modelValue.value = [];
//   dateWithPeriod.value = {};
// };
</script>

<style lang="scss">
.dp__theme_light {
  --dp-background-color: #fff;
  --dp-text-color: #212121;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: var(--primary-color);
  --dp-primary-disabled-color: #6bacea;
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: #ddd;
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #aaaeb7;
  --dp-border-color-focus: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-marker-color: #ff6f60;
  --dp-tooltip-color: #fafafa;
  --dp-disabled-color-text: #8e8e8e;
  --dp-highlight-color: rgb(25 118 210 / 10%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #f3f3f3);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #212121);
  --dp-range-between-border-color: var(--dp-hover-color, #f3f3f3);
}
</style>
