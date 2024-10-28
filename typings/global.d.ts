/*
 * @Author: Jay
 * @Date: 2024-04-13 15:45:42
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-23 10:10:21
 * @FilePath: \vite-vue3-jdm\typings\global.d.ts
 * @Description:
 *
 */

// 请求参数类型
declare namespace Query {
  interface Filters {
    [key: string]: any;
  }
  interface Options {
    [key: string]: any;
  }

  interface GetParams {
    filters?: Filters;
    options?: Options;
  }
}
