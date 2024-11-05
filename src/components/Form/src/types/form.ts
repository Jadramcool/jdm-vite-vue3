/*
 * @Author: jdm
 * @Date: 2024-10-28 15:32:17
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-31 14:47:28
 * @FilePath: \vite-vue3-jdm\src\components\Form\src\types\form.ts
 * @Description:
 *
 */
import type { FormInst, FormProps, GridItemProps, GridProps } from 'naive-ui';
import type { ComponentType } from './components';

export interface FormSchema {
  field: string;
  label: string;
  labelMessage?: string;
  labelMessageStyle?: object | string;
  defaultValue?: any;
  component?: ComponentType;
  query?: 'in' | 'not_in' | undefined;
  componentProps?: Nullable<Recordable>;
  slot?: string;
  rules?: object | object[];
  rule?: object | object[];
  giProps?: GridItemProps;
  isFull?: boolean;
  suffix?: string;
}

export interface NewFormProps extends FormProps {
  // 新增的属性
  schemas: FormSchema[];
  gridProps: GridProps;
  giProps?: GridItemProps;
  inline: boolean;
  layout: string;
  isFull: boolean;
  showSubmitButton?: boolean; // 是否显示提交按钮
  submitButtonText?: string; // 提交按钮文字
  showAdvancedButton?: boolean; // 是否显示展开按钮
  showResetButton?: boolean; // 是否显示重置按钮
  resetButtonText?: string; // 重置按钮文字
  submitOnReset?: boolean; // 重置时是否提交表单
  submitFunc?: () => Promise<void>;
  resetFunc?: () => Promise<void>;
}

export interface FormActionType extends FormInst {
  submit: () => Promise<any>;
  setProps: (formProps: Partial<FormProps>) => Promise<void>;
  setSchema: (schemaProps: Partial<FormSchema[]>) => Promise<void>;
  setFieldsValue: (values: Recordable) => void;
  clearValidate: (name?: string | string[]) => Promise<void>;
  getFieldsValue: () => Recordable;
  resetFields: () => Promise<void>;
  // validate: (nameList?: any[]) => Promise<any>;
  setLoading: (status: boolean) => void;
}
