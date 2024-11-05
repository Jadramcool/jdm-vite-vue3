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

export const columnsUtil = (schema: any, tableFields: string[]): DataTableColumn[] => {
  return schema.properties
    .filter(
      ({ key, table }: any) =>
        tableFields.includes(key) || (table && tableColumnTypes.has(table.type)),
    )
    .map(({ key, label, table }: any) => {
      const title = label ? (typeof label === 'string' ? label : label[0]) : key;

      // 使用对象展开运算符和条件运算符简化返回对象的构建
      return {
        key: table && tableColumnTypes.has(table.type) ? tableColumnsKey[table.type] : key,
        title,
        align: table?.align || tableLayout.align,
        ...table,
      } as DataTableColumn;
    });
};

export const formSchemaUtil = (schema: any, formFields: string[]) => {
  const { properties } = schema;

  return properties
    .filter(({ key, form }: any) => formFields.includes(key) && form?.visible !== false)
    .map(({ key, label, defaultValue, form }: any) => ({
      field: key,
      label,
      defaultValue: form?.defaultValue ?? defaultValue, // 使用 nullish 合并运算符
      ...form,
    }));
};
