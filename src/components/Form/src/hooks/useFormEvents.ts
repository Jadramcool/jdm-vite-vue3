/*
 * @Author: jdm
 * @Date: 2024-10-28 14:22:19
 * @LastEditors: jdm 1051780106@qq.com
 * @LastEditTime: 2025-06-30 14:18:02
 * @FilePath: \vite-vue3-jdm\src\components\Form\src\hooks\useFormEvents.ts
 * @Description: 表格事件
 *
 */
import { isArray, isFunction, isISOString, isNullOrUnDef, isObject } from '@/utils';
import dayjs from 'dayjs';
import _ from 'lodash';
import { nextTick } from 'vue';
import type { FormActionType, FormSchema, NewFormProps } from '../types/form';

declare type EmitType = (event: any, ...args: any[]) => void;

interface UseFormActionContext {
  emit: EmitType;
  getProps: ComputedRef<NewFormProps>;
  getSchema: ComputedRef<FormSchema[]>;
  formModel: Recordable;
  formElRef?: Ref<Nullable<FormActionType>>;
  schemaRef: Ref<FormSchema[]>;
  defaultFormModel: Recordable;
  loadingSub: Ref<boolean>;
  handleFormatFormValues?: (values: Recordable, schema: FormSchema[]) => void;
}

export const useFormEvents = ({
  emit,
  getProps,
  getSchema,
  formModel,
  formElRef,
  schemaRef,
  loadingSub,
  defaultFormModel,
  handleFormatFormValues,
}: UseFormActionContext) => {
  // 验证
  async function validate() {
    return unref(formElRef)?.validate();
  }

  // 清空校验
  function clearValidate() {
    unref(formElRef)?.restoreValidation();
  }

  // 校验单独字段
  function validateFields(fields: Undefinedable<string | string[]>) {
    return unref(formElRef)?.validate(
      (errors) => {
        if (errors) {
          console.error(errors);
        }
      },
      (rule) => {
        if (isArray(fields)) {
          return !!(fields && fields.includes(rule?.key as string));
        }
        return rule?.key === fields;
      },
    );
  }

  // 提交事件
  const handleSubmit = async (event?: Event): Promise<object | boolean | undefined> => {
    event && event.preventDefault();
    loadingSub.value = true;
    // 针对自定义的提交,忽略validate
    const { submitFunc } = unref(getProps);
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc();
      return;
    }

    const formEl = unref(formElRef);
    if (!formEl) return false;

    try {
      await validate();
      const values = getFieldsValue();
      loadingSub.value = false;
      emit('submit', values);
      return values;
    } catch (error: any) {
      // emit('submit', false);
      loadingSub.value = false;
      console.error(error);
      return false;
    }
  };

  // 重置表单
  const resetFields = async () => {
    const { resetFunc, submitOnReset, resetPageOnReset, tableRef } = unref(getProps);
    resetFunc && isFunction(resetFunc) && (await resetFunc());

    const formEl = unref(formElRef);
    if (!formEl) return;

    const defaultModel = unref(defaultFormModel) || {};
    Object.keys(formModel).forEach((key) => {
      formModel[key] = defaultModel[key] ?? null;
    });

    clearValidate();

    // 发射reset事件，让父组件可以监听并执行自定义逻辑
    const fromValues = getFieldsValue();
    emit('reset', fromValues);

    await nextTick();

    // 如果启用重置并请求功能，并且重置页码到第一页（如果启用了此功能且提供了tableRef）
    if (resetPageOnReset && submitOnReset && tableRef && unref(tableRef)) {
      const tableInstance = unref(tableRef);
      if (tableInstance && isFunction(tableInstance.setPagination)) {
        tableInstance.setPagination({ page: 1 });
        // 如果有reload方法，也调用它来刷新数据
        if (isFunction(tableInstance.reload)) {
          tableInstance.reload();
        }
      }
    }
  };

  // 获取表单值
  function getFieldsValue(): Recordable {
    const formEl = unref(formElRef);
    if (!formEl) return {};

    const schemas = unref(getSchema) || [];
    // 处理in not_in 的数据
    const formatFieldsValue =
      schemas &&
      handleFormatFormValues &&
      isFunction(handleFormatFormValues) &&
      handleFormatFormValues(unref(formModel), schemas);
    return formatFieldsValue || toRaw(unref(formModel));
  }

  // 设置表单字段值
  async function setFieldsValue(values: Recordable): Promise<void> {
    const schemas = unref(getSchema) || [];
    const fields = schemas.map((item) => item.field).filter(Boolean);

    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (fields.includes(key)) {
        // 针对时间格式，将ISOString转为时间戳
        if (isArray(value) && typeof value[0] === 'string' && isISOString(value[0])) {
          formModel[key] = value.map((val: string) => dayjs(val).valueOf() || val);
        } else if (typeof value === 'string' && isISOString(value)) {
          formModel[key] = dayjs(value).valueOf();
        } else {
          formModel[key] = value;
        }
      }
    });
  }

  // 设置默认值
  async function setDefaultValue(data: FormSchema | FormSchema[]) {
    let schemas: FormSchema[] = [];
    if (isObject(data)) {
      schemas.push(data as FormSchema);
    }
    if (isArray(data)) {
      schemas = [...(data as FormSchema[])];
    }

    const obj: Recordable = {};
    schemas.forEach((item) => {
      if (Reflect.has(item, 'field') && item.field && !isNullOrUnDef(item.defaultValue)) {
        obj[item.field] = item.defaultValue;
      }
    });
    await setFieldsValue(obj);
  }

  // 更新schema
  async function updateSchema(data: Partial<FormSchema> | Partial<FormSchema>[]) {
    let updateData: Partial<FormSchema>[] = [];
    if (isObject(data)) {
      updateData.push(data as FormSchema);
    } else if (isArray(data)) {
      updateData = [...(data as FormSchema[])];
    }
    const hasField = updateData.every((item) => Reflect.has(item, 'field') && item.field);

    if (!hasField) {
      console.error('所有需要更新的schema必须包含field字段，请检查updateSchema方法的传入参数');
      return;
    }
    const schema: FormSchema[] = [];
    const updatedSchema: FormSchema[] = [];
    unref(getSchema).forEach((val) => {
      const updatedItem = updateData.find((item) => val.field === item.field);

      if (updatedItem) {
        const newSchema = _.merge({}, val, updatedItem);
        updatedSchema.push(newSchema as FormSchema);
        schema.push(newSchema as FormSchema);
      } else {
        schema.push(val);
      }
    });
    setDefaultValue(updatedSchema);

    schemaRef.value = _.uniqBy(schema, 'field');
  }

  return {
    getFieldsValue,
    handleSubmit,
    resetFields,
    validate,
    clearValidate,
    setFieldsValue,
    updateSchema,
    validateFields,
  };
};
