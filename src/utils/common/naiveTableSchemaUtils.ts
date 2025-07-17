/*
 * @Author: jdm
 * @Date: 2024-10-28 11:49:11
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-28 14:52:28
 * @FilePath: \vite-vue3-jdm\src\utils\common\naiveTableSchemaUtils.ts
 * @Description:
 *
 */
import componentSetting from '@/settings/componentSettings';
import type { DataTableColumn } from 'naive-ui';

// 组件配置
const { table } = componentSetting;
const { tableLayout } = table;

const tableColumnsKey: Record<string, string> = {
  selection: '__selection__',
  expand: '__expand__',
};

// 表格列类型
const tableColumnTypes = new Set(['selection', 'expand']);

// 表格列配置
export const columnsUtil = (schema: any, tableFields: string[]): DataTableColumn[] => {
  // 创建一个映射，记录 tableFields 中每个 key 的位置
  const tableFieldsIndex: { [key: string]: number } = tableFields.reduce(
    (acc: Recordable, key, index) => {
      acc[key] = index;
      return acc;
    },
    {},
  );
  const { properties, setting } = schema;
  return properties
    .filter(
      ({ key, table }: any) =>
        tableFields.includes(key) || (table && tableColumnTypes.has(table.type)),
    )
    .map(({ key, label, table, ifShow }: any) => {
      const title = label ? (typeof label === 'string' ? label : label[0]) : key;

      // 使用对象展开运算符和条件运算符简化返回对象的构建
      return {
        key: table && tableColumnTypes.has(table.type) ? tableColumnsKey[table.type] : key,
        title,
        ...(ifShow !== undefined ? { ifShow } : {}),
        align: table?.align || tableLayout.align,
        ...setting.table,
        ...table,
      } as DataTableColumn;
    })
    .sort((a: Recordable, b: Recordable) => {
      // 根据 tableFields 中 key 的顺序进行排序
      const indexA = tableFieldsIndex[a.key];
      const indexB = tableFieldsIndex[b.key];
      return indexA - indexB;
    });
};

// 查询表单字段配置
export const formSchemaUtil = (schema: any, formFields: string[]) => {
  const { properties, setting } = schema;

  // 创建一个映射，记录 formFields 中每个 key 的位置
  const formFieldsIndex: { [key: string]: number } = formFields.reduce(
    (acc: Recordable, key, index) => {
      acc[key] = index;
      return acc;
    },
    {},
  );

  // 过滤并映射字段配置
  const result = properties
    .filter(({ key, form }: any) => formFields.includes(key) && form?.visible !== false)
    .map(({ key, label, defaultValue, form, ifShow }: any) => ({
      field: form.key || key,
      label,
      ...(ifShow !== undefined ? { ifShow } : {}),
      defaultValue: form?.defaultValue ?? defaultValue, // 使用 nullish 合并运算符
      ...(setting.form || {}),
      ...form,
    }));

  // 根据 formFields 中的顺序对 result 进行排序
  return result.sort((a: Recordable, b: Recordable) => {
    const indexA = formFieldsIndex[a.field];
    const indexB = formFieldsIndex[b.field];
    return indexA - indexB; // 按照顺序排序
  });
};

// 编辑表单字段配置
export const editFormSchemaUtil = (schema: any, editFormFields: string[]) => {
  const { properties, setting } = schema;

  // 创建一个映射，记录 editFormFields 中每个 key 的位置
  const editFormFieldsIndex: { [key: string]: number } = editFormFields.reduce(
    (acc: Recordable, key, index) => {
      acc[key] = index;
      return acc;
    },
    {},
  );

  // 过滤并映射字段配置
  const result = properties
    .filter(({ key, editForm }: any) => editFormFields.includes(key) && editForm?.visible !== false)
    .map(({ key, label, defaultValue, form, editForm, ifShow }: any) => {
      const fieldConfig = {
        field: editForm.key || form.key || key,
        label,
        ...(ifShow !== undefined ? { ifShow } : {}),
        defaultValue: editForm?.defaultValue ?? defaultValue,
        ...(setting?.form || {}),
        ...(form || {}),
        ...editForm,
      };

      // 删除 query 字段
      delete fieldConfig.query;

      return fieldConfig;
    });

  // 根据 editFormFields 中的顺序对 result 进行排序
  return result.sort((a: Recordable, b: Recordable) => {
    const indexA = editFormFieldsIndex[a.field];
    const indexB = editFormFieldsIndex[b.field];
    return indexA - indexB; // 按照顺序排序
  });
};

// 详情字段配置
export const descriptionSchemaUtil = (schema: any, descriptionFields: string[]) => {
  const { properties } = schema;

  // 创建一个映射，记录 formFields 中每个 key 的位置
  const formFieldsIndex: { [key: string]: number } = descriptionFields.reduce(
    (acc: Recordable, key, index) => {
      acc[key] = index;
      return acc;
    },
    {},
  );

  // 过滤并映射字段配置
  const result = properties
    .filter(({ key }: any) => descriptionFields.includes(key))
    .map(({ key, label, defaultValue, description, table }: any) => ({
      field: key,
      label,
      defaultValue: description?.defaultValue ?? defaultValue, // 使用 nullish 合并运算符
      ...description,
      render: description?.render || table?.render || null,
    }));
  // 根据 formFields 中的顺序对 result 进行排序
  return result.sort((a: Recordable, b: Recordable) => {
    const indexA = formFieldsIndex[a.field];
    const indexB = formFieldsIndex[b.field];
    return indexA - indexB; // 按照顺序排序
  });
};
