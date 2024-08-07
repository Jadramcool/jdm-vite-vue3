/*
 * @Author: Jay
 * @Date: 2024-04-13 15:45:42
 * @LastEditors: Jay
 * @LastEditTime: 2024-07-24 14:31:21
 * @FilePath: \vite-vue3-jdm\typings\global.d.ts
 * @Description:
 *
 */
declare namespace App {
  type lang = 'zhCN' | 'en';
  // 动画过渡类型
  type TransitionAnimation =
    | ''
    | 'fade-slide'
    | 'fade-bottom'
    | 'fade-scale'
    | 'zoom-fade'
    | 'zoom-out';
}
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
