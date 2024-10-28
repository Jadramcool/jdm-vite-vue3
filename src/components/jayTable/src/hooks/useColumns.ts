/*
 * @Author: jdm
 * @Date: 2024-10-21 16:02:00
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-28 11:39:00
 * @FilePath: \vite-vue3-jdm\src\components\jayTable\src\hooks\useColumns.ts
 * @Description: 没有适配children，我也不知道怎么弄，后面学了ts再说吧
 *
 */
import { $t } from '@/locales/i18n';
import type { DataTableBaseColumn } from 'naive-ui';

// 表格列类型
const tableColumnTypes = ['selection', 'expand'];

const SELECTION_KEY = '__selection__';

const EXPAND_KEY = '__expand__';

export const useColumns = (refProps: any) => {
  const { columns } = unref(refProps);

  // ------------------------------ 这个是控制列的显示和排序的 --------------------
  // 这里的columnsRef是个Ref<DataTableBaseColumn[]>
  const columnsRef: Ref<DataTableBaseColumn[]> = ref(columns);

  // 获取所有列
  const getColumns = computed(() => {
    return columnsRef.value;
  });

  // 获取选中的列
  const getColumnChecks = (columns: DataTableBaseColumn[]): NaiveUI.TableColumnCheck[] => {
    return columns.reduce<NaiveUI.TableColumnCheck[]>((acc, column) => {
      if (column.type && tableColumnTypes.includes(column.type)) {
        if (column.type === 'selection') {
          acc.push({
            key: SELECTION_KEY,
            title: $t('table.check'),
            checked: true,
          });
        } else if (column.type === 'expand') {
          acc.push({
            key: EXPAND_KEY,
            title: $t('table.expandColumn'),
            checked: true,
          });
        }
      } // 排除表格列类型
      else if (!column.type) {
        acc.push({
          title: column.title as string,
          key: column.key as string,
          checked: true,
        });
      }

      return acc;
    }, []);
  };

  // 选中的列
  const columnChecks = ref<NaiveUI.TableColumnCheck[]>(getColumnChecks(columns));

  // 监听选中的列变化
  watch(
    columnChecks,
    <T extends NaiveUI.TableColumnCheck>(newVal: T[]) => {
      try {
        // 清空 columnsRef 的值
        columnsRef.value = newVal
          .filter((column: NaiveUI.TableColumnCheck) => column.checked)
          .map((item) => {
            const index = columns.findIndex(
              (column: DataTableBaseColumn) => column.key === item.key,
            );
            // 如果找到该列，则返回，否则返回 null
            return index !== -1 ? columns[index] : null;
          })
          .filter((column) => column !== null) as DataTableBaseColumn[]; // 过滤掉 null 值
      } catch (error) {
        console.error('Error updating columnsRef:', error);
      }
    },
    {
      deep: true,
    },
  );

  // ------------------------------ 这个是跟表格数据相关的 --------------------

  return { columns, columnChecks, getColumns, getColumnChecks };
};
