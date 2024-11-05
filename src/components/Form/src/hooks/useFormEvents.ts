/*
 * @Author: jdm
 * @Date: 2024-10-28 14:22:19
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-31 14:38:51
 * @FilePath: \vite-vue3-jdm\src\components\Form\src\hooks\useFormEvents.ts
 * @Description: 表格事件
 *
 */
import { isFunction } from '@/utils';
import type { FormActionType, FormSchema, NewFormProps } from '../types/form';

declare type EmitType = (event: any, ...args: any[]) => void;

interface UseFormActionContext {
  emit: EmitType;
  getProps: ComputedRef<NewFormProps>;
  getSchema?: ComputedRef<FormSchema[]>;
  formModel: Recordable;
  formElRef?: Ref<Nullable<FormActionType>>;
  defaultFormModel?: Recordable;
  loadingSub: Ref<boolean>;
  handleFormatFormValues?: (values: Recordable, schema: FormSchema[]) => void;
}

export const useFormEvents = ({
  emit,
  getProps,
  getSchema,
  formModel,
  formElRef,
  loadingSub,
  defaultFormModel,
  handleFormatFormValues,
}: UseFormActionContext) => {
  // 验证
  async function validate() {
    return unref(formElRef)?.validate();
  }

  // 清空校验
  async function clearValidate() {
    await unref(formElRef)?.restoreValidation();
  }

  // 提交事件
  const handleSubmit = async (event?: Event): Promise<object | boolean> => {
    event && event.preventDefault();
    loadingSub.value = true;
    // 针对自定义的提交,忽略validate
    const { submitFunc } = unref(getProps);
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc();
      loadingSub.value = false;
      return false;
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
      emit('submit', false);
      loadingSub.value = false;
      console.error(error);
      return false;
    }
  };

  // 重置表单
  const resetFields = async () => {
    const { resetFunc, submitOnReset } = unref(getProps);
    resetFunc && isFunction(resetFunc) && (await resetFunc());

    const formEl = unref(formElRef);
    if (!formEl) return;

    const defaultModel = unref(defaultFormModel) || {};
    Object.keys(formModel).forEach((key) => {
      formModel[key] = defaultModel[key] || null;
    });
    await clearValidate();
    // const fromValues = handleFormValues(toRaw(unref(formModel)));
    // emit('reset', fromValues);
    submitOnReset && (await handleSubmit());
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
    // return toRaw(unref(formModel));
  }

  return {
    getFieldsValue,
    handleSubmit,
    resetFields,
  };
};
