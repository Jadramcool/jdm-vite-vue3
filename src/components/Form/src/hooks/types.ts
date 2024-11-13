/*
 * @Author: jdm
 * @Date: 2024-05-30 10:29:46
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-28 14:07:17
 * @FilePath: \vite-vue3-jdm\src\components\Form\src\hooks\types.ts
 * @Description:
 *
 */
import type { FormProps } from 'naive-ui';
import { FormSchema } from '../types';

type FormType =
  | 'input'
  | 'password'
  | 'select'
  | 'datepicker'
  | 'timepicker'
  | 'switch'
  | 'radio'
  | 'textarea';
interface ItemOption {
  label: string;
  value: string | number;
}

export interface FormItem {
  field: string; // 字段名
  type?: FormType; // 输入框类型
  label: string; // 输入框标题
  colSpan?: number; // 栅格占据的列数默认24
  disabled?: boolean; // 表单是否可修改 默认false
  placeholder?: any; // 输入框默认显示内容
  prop?: string; // 表单校验
  options?: ItemOption[]; // 选择器的可选子选项 select
  otherOptions?: any; // 特殊情况
  isHidden?: boolean;
  slotName?: string; // 处理一些自定义内容
}
export interface FormOption {
  formItems: FormItem[];
  labelWidth?: string; // 标签的长度
}

export interface FormActionType {
  submit: () => Promise<any>;
  setProps: (formProps: Partial<FormProps>) => Promise<void>;
  updateSchema: (schemaProps: Partial<FormSchema[]>) => Promise<void>;
  setFieldsValue: (values: Recordable) => void;
  clearValidate: (name?: string | string[]) => Promise<void>;
  getFieldsValue: (needFormat?: boolean) => Recordable;
  resetFields: () => Promise<void>;
  validate: (nameList?: any[]) => Promise<any>;
  setLoading: (status: boolean) => void;
}
