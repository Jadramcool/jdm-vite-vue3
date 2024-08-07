/*
 * @Author: Jay
 * @Date: 2024-04-13 15:45:42
 * @LastEditors: Jay
 * @LastEditTime: 2024-08-01 14:37:48
 * @FilePath: \vite-vue3-jdm\src\utils\common\i18n.ts
 * @Description:
 *
 */
import type { NDateLocale, NLocale } from 'naive-ui';
import { dateZhCN, zhCN, dateEnUS, enUS } from 'naive-ui';
import i18n from '@/locales';

export function setLocale(locale: App.lang) {
  i18n.global.locale.value = locale;
}

export const $t = i18n.global.t;

export const naiveI18nOptions: Record<
  any,
  { locale: NLocale | null; dateLocale: NDateLocale | null }
> = {
  zhCN: {
    locale: zhCN,
    dateLocale: dateZhCN,
  },
  enUS: {
    locale: enUS,
    dateLocale: dateEnUS,
  },
};
