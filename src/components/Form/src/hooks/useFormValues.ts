/*
 * @Author: jdm
 * @Date: 2024-10-28 14:22:19
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-31 14:43:43
 * @FilePath: \vite-vue3-jdm\src\components\Form\src\hooks\useFormValues.ts
 * @Description: 表格事件
 *
 */
import { isArray, isFunction, isNullOrUnDef, isObject, isString } from '@/utils';
import { set } from 'lodash';
import type { FormSchema } from '../types/form';

interface UseFormValuesContext {
  defaultFormModel: Ref<any>;
  getSchema: ComputedRef<FormSchema[]>;
  formModel: Recordable;
}

export const useFormValues = ({ defaultFormModel, getSchema, formModel }: UseFormValuesContext) => {
  const handleFormValues = (values: Recordable) => {
    if (!isObject(values)) {
      return {};
    }

    const res: Recordable = {};

    for (const [key, originalValue] of Object.entries(values)) {
      // 确保 key 是有效的，并检查其他条件
      if (
        key &&
        !(isArray(originalValue) && originalValue.length === 0) &&
        !isFunction(originalValue) &&
        !isNullOrUnDef(originalValue)
      ) {
        // 处理值
        let value = originalValue;
        if (isString(value)) {
          value = value.trim(); // 删除空格
        }
        set(res, key, value);
      }
    }

    return res;
  };

  // 处理请求参数，处理query字段，in not_in的情况
  const handleFormatFormValues = (values: Recordable, schemas: FormSchema[]) => {
    const formatValues = handleFormValues(values);
    const newValues: Recordable = {};
    Object.entries(formatValues).forEach(([key, value]: string[]) => {
      const schema = schemas.find((s) => s.field === key);
      if (schema) {
        const newKey = schema.query ? `${schema.field}__${schema.query}` : schema.field;
        newValues[newKey] = value;
        formModel[key] = value; // 根据query字段分组
      }
    });
    return newValues;
  };

  const initDefaultFormModel = () => {
    const schemas = unref(getSchema);
    const defaultForm: Recordable = {};
    schemas.forEach((schema) => {
      const { defaultValue } = schema;
      if (!isNullOrUnDef(defaultValue)) {
        const valueKey = schema.field;
        defaultForm[valueKey] = defaultValue;
        formModel[valueKey] = defaultValue; // 根据query字段分组
      }
    });
    defaultFormModel.value = defaultForm;
  };

  return { handleFormValues, handleFormatFormValues, initDefaultFormModel };
};
