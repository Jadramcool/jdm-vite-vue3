/*
 * @Author: Jay
 * @Date: 2024-04-13 15:45:42
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-30 17:57:23
 * @FilePath: \vite-vue3-jdm\typings\global.d.ts
 * @Description:
 *
 */

// 请求参数类型
declare namespace Query {
  interface Filters extends Recordable {}

  interface Options extends Recordable {}

  interface Pagination extends Recordable {}

  interface GetParams {
    filters?: Filters;
    options?: Options;
    pagination?: Pagination;
  }
}

declare type Recordable<T = any> = Record<string, T>; // 类型别名，表示一个对象，其属性名为字符串字面量，属性值可以为任意类型
declare type Nullable<T> = T | null; // 类型别名，表示可以为null的类型
declare type Undefinedable<T> = T | undefined; // 类型别名，表示可以为undefined的类型
