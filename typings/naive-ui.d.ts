/*
 * @Author: jdm
 * @Date: 2024-10-21 15:55:10
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-28 15:32:01
 * @FilePath: \vite-vue3-jdm\typings\naive-ui.d.ts
 * @Description:
 *
 */

declare namespace NaiveUI {
  interface TableColumnCheck {
    key: string;
    title: string;
    checked: boolean;
  }

  interface RowData {
    id: number;
    [key: string]: any;
  }
}
