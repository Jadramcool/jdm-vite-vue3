<template>
  <NFormItemGi :label="schema.label" :path="schema.field">
    <template #label v-if="schema.labelMessage">
      {{ schema.label }}
      <NTooltip trigger="hover" :style="schema.labelMessageStyle">
        <template #trigger>
          <JayIcon :icon="'mynaui:question-waves'" :hover="true" :size="14" />
        </template>
        {{ schema.labelMessage }}
      </NTooltip>
    </template>

    <NRadioGroup
      v-if="schema.component === 'NRadioGroup'"
      v-bind="componentProps"
      v-model:value="formModelValue[schema.field]"
      :ref="(el: any) => setRef(el)"
    >
      <NRadio
        v-for="option in componentProps?.options ?? []"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </NRadio>
    </NRadioGroup>

    <NCheckboxGroup
      v-else-if="schema.component === 'NCheckboxGroup'"
      v-bind="componentProps"
      v-model:value="formModelValue[schema.field]"
      :ref="(el: any) => setRef(el)"
    >
      <NCheckbox
        v-for="option in componentProps?.options ?? []"
        :key="option.value"
        :value="option.value"
        :label="option.label"
      />
    </NCheckboxGroup>

    <ApiSelect
      v-else-if="schema.component === 'ApiSelect'"
      v-bind="componentProps"
      v-model:value="formModelValue[schema.field]"
      :ref="(el: any) => setRef(el)"
    />

    <ApiTreeSelect
      v-else-if="schema.component === 'ApiTreeSelect'"
      v-bind="componentProps"
      v-model:value="formModelValue[schema.field]"
      :ref="(el: any) => setRef(el)"
    />

    <DatePicker
      v-else-if="schema.component === 'NDatePicker'"
      v-bind="componentProps"
      v-model:value="formModelValue[schema.field]"
      :ref="(el: any) => setRef(el)"
    />

    <ApiTree
      v-else-if="schema.component === 'ApiTree'"
      v-bind="componentProps"
      v-model:value="formModelValue[schema.field]"
      :ref="(el: any) => setRef(el)"
    />

    <MutiDatePicker
      v-else-if="schema.component === 'MutiDatePicker'"
      v-bind="componentProps"
      v-model:value="formModelValue[schema.field]"
      :ref="(el: any) => setRef(el)"
    />

    <IconPicker
      v-else-if="schema.component === 'IconPicker'"
      v-bind="componentProps"
      v-model:value="formModelValue[schema.field]"
      :ref="(el: any) => setRef(el)"
    />

    <component
      v-else-if="componentMap.has(schema.component)"
      v-bind="componentProps"
      v-model:value="formModelValue[schema.field]"
      :is="componentMap.get(schema.component)"
      :class="{ 'is-full': schema.isFull !== false && isFull && schema.component !== 'NSwitch' }"
      :ref="(el: HTMLElement) => setRef(el)"
    />

    <slot
      v-else-if="schema.slot && $slots[schema.slot]"
      :model="formModelValue"
      :field="schema.field"
      :schema="schema"
      :name="schema.slot"
    />
  </NFormItemGi>
</template>

<script setup lang="ts">
import { NCheckboxGroup, NRadio } from 'naive-ui';
import { MutiDatePicker, JayIcon } from '@/components';
import { componentMap } from '../componentMap';
import ApiSelect from './ApiSelect.vue';
import ApiTree from './ApiTree.vue';
import ApiTreeSelect from './ApiTreeSelect.vue';
import DatePicker from './DatePicker.vue';
import IconPicker from './IconPicker.vue';
import type { FormSchema } from '../types';

defineSlots<{
  [key: string]: any;
}>();

interface Props {
  schema: FormSchema;
  componentPropsMap: Record<string, any>;
  isFull?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isFull: true,
});

const formModel = defineModel<Record<string, any>>('formModel', { default: () => ({}) });

const formModelValue = computed({
  get: () => formModel.value,
  set: (val) => {
    formModel.value = val;
  },
});

const emit = defineEmits<{
  setRef: [field: string, el: any];
}>();

const componentProps = computed(() => props.componentPropsMap[props.schema.field]);

const setRef = (el: any) => {
  emit('setRef', props.schema.field, el);
};
</script>

<style lang="scss" scoped>
.is-full {
  width: 100%;
}
</style>
