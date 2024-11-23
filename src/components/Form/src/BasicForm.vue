<!--
 * @Author: jdm
 * @Date: 2024-10-28 11:49:11
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-31 14:59:29
 * @FilePath: \vite-vue3-jdm\src\components\Form\src\BasicForm.vue
 * @Description: 
 * 
-->
<!-- v-bind一定要写在最前面！！！防止被覆盖掉，导致功能失效，记录2024-10-29 18:18:35 被坑害了一下午！！！！！ -->
<template>
  <NForm v-bind="getBindValue" :model="formModel" ref="formElRef">
    <NGrid v-bind="getGrid">
      <template v-for="schema in getSchema">
        <NGi v-bind="schema.giProps" v-if="getShow(schema).isIfShow" :key="schema.field">
          <NFormItemGi :label="schema.label" :path="schema.field">
            <!-- 左侧提示 -->
            <template #label v-if="schema.labelMessage">
              {{ schema.label }}
              <NTooltip trigger="hover" :style="schema.labelMessageStyle">
                <template #trigger>
                  <JayIcon :icon="'mynaui:question-waves'" :hover="true" :size="14" />
                </template>
                {{ schema.labelMessage }}
              </NTooltip>
            </template>
            <template v-if="schema.component === 'NRadioGroup'">
              <NRadioGroup
                v-bind="schema.componentProps"
                v-model:value="formModel[schema.field]"
                :ref="
                  (el: any) => {
                    setComponentRef(schema.field, el);
                  }
                "
              >
                <NRadio
                  v-for="option in (schema.componentProps && schema.componentProps.options) || []"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </NRadio>
              </NRadioGroup>
            </template>
            <template v-else-if="schema.component === 'NCheckboxGroup'">
              <NCheckboxGroup
                v-model:value="formModel[schema.field]"
                :ref="
                  (el: any) => {
                    setComponentRef(schema.field, el);
                  }
                "
              >
                <NCheckbox
                  v-for="option in (schema.componentProps && schema.componentProps.options) || []"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                >
                </NCheckbox>
              </NCheckboxGroup>
            </template>
            <template v-else-if="schema.component === 'ApiSelect'">
              <ApiSelect
                v-bind="getComponentProps(schema)"
                v-model:value="formModel[schema.field]"
                :ref="
                  (el: any) => {
                    setComponentRef(schema.field, el);
                  }
                "
              />
            </template>
            <template v-else-if="schema.component === 'ApiTreeSelect'">
              <ApiTreeSelect
                v-bind="getComponentProps(schema)"
                v-model:value="formModel[schema.field]"
                :ref="
                  (el: any) => {
                    setComponentRef(schema.field, el);
                  }
                "
              />
            </template>

            <template v-else-if="schema.component === 'NDatePicker'">
              <DatePicker
                v-bind="getComponentProps(schema)"
                v-model:value="formModel[schema.field]"
                :ref="
                  (el: any) => {
                    setComponentRef(schema.field, el);
                  }
                "
              />
            </template>
            <template v-else-if="schema.component === 'ApiTree'">
              <ApiTree
                v-bind="getComponentProps(schema)"
                v-model:value="formModel[schema.field]"
                :ref="
                  (el: any) => {
                    setComponentRef(schema.field, el);
                  }
                "
              />
            </template>
            <!--判断插槽-->
            <template v-else>
              <component
                v-bind="getComponentProps(schema)"
                v-model:value="formModel[schema.field]"
                :is="componentMap.get(schema.component)"
                :class="{
                  isFull:
                    schema.isFull != false && getProps.isFull && schema.component !== 'NSwitch',
                }"
                :ref="
                  (el: HTMLElement) => {
                    setComponentRef(schema.field, el);
                  }
                "
              />
            </template>
          </NFormItemGi>
        </NGi>
      </template>
      <NGi
        :span="isInline ? '' : 24"
        :suffix="isInline ? true : false"
        v-if="getProps.showActionButtonGroup"
      >
        <NSpace align="center" :justify="isInline ? 'end' : 'start'">
          <NButton
            v-if="getProps.showSubmitButton"
            v-bind="getSubmitBtnOptions"
            @click="handleSubmit"
            :loading="loadingSub"
            >{{ getProps.submitButtonText ?? $t('common.search') }}</NButton
          >

          <NButton
            v-if="getProps.showResetButton"
            v-bind="getResetBtnOptions"
            @click="resetFields"
            >{{ getProps.resetButtonText ?? $t('common.reset') }}</NButton
          >
          <NButton
            type="primary"
            text
            icon-placement="right"
            v-if="isInline && getProps.showAdvancedButton && getSchema.length > 3"
            @click="unfoldToggle"
          >
            {{ overflow ? '展开' : '收起' }}
          </NButton>
        </NSpace>
      </NGi>
    </NGrid>
  </NForm>
</template>

<script setup lang="ts">
import { isArray, isBoolean, isFunction } from '@/utils';
import _ from 'lodash';
import { NRadio, type GridProps } from 'naive-ui';
import { componentMap } from './componentMap';
import { ApiSelect, ApiTree, ApiTreeSelect, DatePicker } from './components';
import { createPlaceholderMessage } from './helper';
import { useFormEvents, useFormValues } from './hooks';
import { basicProps } from './props';
import { FormActionType, FormSchema, NewFormProps } from './types';

defineOptions({ name: 'BasicForm' });

const props = defineProps(basicProps);
const emit = defineEmits(['register', 'reset']);

const defaultFormModel = ref<Recordable>({}); // 默认的表单model
const formModel = reactive<Recordable>({}); // 表单model
const formElRef = ref<Nullable<FormActionType>>(null); // 表单的ref
const propsRef = ref<Partial<NewFormProps>>({}); // 表单props
const schemaRef = ref<Nullable<FormSchema[]>>(null); // 表单schema
const gridCollapsed = ref<boolean>(false); // 表单是否折叠
const loadingSub = ref<boolean>(false); // 表单提交loading
const overflow = ref<boolean>(false); // 表单是否折叠
const isUpdateDefault = ref<boolean>(false); // 是否更新默认值

// 收集动态组件的实例
const componentInstances = ref<Record<string, any>>({});

const setComponentRef = (field: string, el: any) => {
  if (el) {
    componentInstances.value[field] = el;
  }
};
// 获取props
const getProps = computed((): NewFormProps => {
  // const formProps = { ...props, ...unref(propsRef) } as NewFormProps;
  const formProps = _.merge({}, props, unref(propsRef)) as NewFormProps;
  const rulesObj: any = {
    rules: {},
  };
  const schemas: FormSchema[] = formProps.schemas || [];
  schemas.forEach((item) => {
    if (item.rules && isArray(item.rules)) {
      // 给rules添加key属性,用来单个校验
      (item.rules as object[]).forEach((rule: any) => {
        rule.key = item.field;
      });
      rulesObj.rules[item.field] = item.rules;
    }
  });
  return { ...formProps, ...unref(rulesObj) };
});

// 表单的bind值，默认的props和传递的props合并
const getBindValue = computed(() => {
  return { ...props, ...unref(getProps) } as Recordable;
});

// 获取表单schema
const getSchema = computed((): FormSchema[] => {
  const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any);
  // for (const schema of schemas) {
  //   // 留给日期组件用
  //   // const { defaultValue } = schema;
  //   // if (defaultValue) {
  //   //   schema.defaultValue = defaultValue;
  //   // }
  //   // const isShow = getShow(schema);
  //   // schema.show = isShow.isIfShow;
  // }
  return schemas as FormSchema[];
});

const getShow = (schema: FormSchema): { isIfShow: boolean } => {
  const { ifShow } = schema;

  // 判断ifShow是否存在 安全地使用 ifShow
  if (ifShow !== undefined) {
    let isIfShow: any = true;
    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }

    if (isFunction(ifShow)) {
      const getValues = {
        values: { ...unref(getFieldsValue()) },
        schema,
      };
      isIfShow = ifShow(getValues);
    }

    return { isIfShow };
  }
  return { isIfShow: true };
};

const { handleFormatFormValues, initDefaultFormModel } = useFormValues({
  defaultFormModel,
  getSchema,
  formModel,
});

const {
  handleSubmit,
  resetFields,
  getFieldsValue,
  validate,
  clearValidate,
  setFieldsValue,
  updateSchema,
  validateFields,
} = useFormEvents({
  emit,
  getProps,
  getSchema,
  formModel,
  formElRef,
  schemaRef: schemaRef as Ref<FormSchema[]>,
  loadingSub,
  defaultFormModel,
  handleFormatFormValues,
});

// 获取表单动态组件的props
const getComponentProps = (schema: FormSchema) => {
  const { component, componentProps = {} } = schema; // 使用解构赋值
  return {
    // clearable: true,
    placeholder: createPlaceholderMessage(unref(component)),
    ...componentProps,
  };
};

// 设置表单schema，注册的时候调用
async function setProps(formProps: Partial<NewFormProps>): Promise<void> {
  propsRef.value = _.merge(unref(propsRef) || {}, formProps);
}

const isInline = computed(() => {
  const { layout } = unref(getProps);
  return layout === 'inline';
});

const getGrid = computed((): GridProps => {
  const { gridProps } = unref(getProps);
  return {
    ...gridProps,
    collapsed: isInline.value ? gridCollapsed.value : false,
    responsive: 'screen',
  };
});

watch(
  () => getSchema.value,
  (schema: FormSchema[]) => {
    if (!unref(isUpdateDefault) && schema?.length) {
      initDefaultFormModel();
      isUpdateDefault.value = true;
    }
  },
);

// ------------------按钮------------------
const getSubmitBtnOptions = computed(() => {
  return {
    size: props.size,
    type: 'primary',
    ...props.submitButtonOptions,
  };
});

const getResetBtnOptions = computed(() => {
  return {
    size: props.size,
    ...props.resetButtonOptions,
  };
});

// 展开/收起表单
const unfoldToggle = () => {
  gridCollapsed.value = !gridCollapsed.value;
  overflow.value = gridCollapsed.value;
};

// 获取组件实例
const getComponentInstance = (field: string) => {
  return componentInstances.value[field];
};

const formActionType = {
  getFieldsValue,
  setFieldsValue,
  setProps,
  resetFields,
  validate,
  validateFields,
  clearValidate,
  submit: handleSubmit,
  updateSchema,
  getComponentInstance, // 获取组件实例
};

onMounted(() => {
  emit('register', formActionType);
});
</script>

<style lang="scss" scoped>
.isFull {
  width: 100%;
  justify-content: flex-start;
}
</style>
