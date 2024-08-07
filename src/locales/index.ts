/*
 * @Author: Jay
 * @Date: 2024-08-07 11:04:18
 * @LastEditors: Jay
 * @LastEditTime: 2024-08-07 11:06:06
 * @FilePath: \vite-vue3-jdm\src\locales\index.ts
 * @Description:
 *
 */
import { createI18n } from 'vue-i18n';
import { lStorage } from '@/utils';
// import en from './lang/en.json';
// import zhCN from './lang/zh-CN.json';

// TODO 想改成自动引入的形式
// const messages = {
//   zhCN: {
//     ...zhCN,
//   },
//   en: {
//     ...en,
//   },
// };

// 动态导入语言包
async function loadLocaleMessages(locale: string) {
  const messages = await import(`./lang/${locale}.json`);
  return messages.default;
}

export async function createI18nInstance() {
  const lang = lStorage.getItem('lang') || 'zhCN';

  const messages = {
    [lang]: await loadLocaleMessages(lang),
  };

  const i18n11 = createI18n({
    locale: lang,
    fallbackLocale: 'zhCN',
    globalInjection: true,
    legacy: false,
    messages,
    silentFallbackWarn: true,
    silentTranslationWarn: true,
    missingWarn: false,
    fallbackWarn: false,
    missing: (locale, key) => {
      console.warn(`翻译缺失: ${key}`);
      return key;
    },
  });

  return i18n11;
}

// export const i18n: ReturnType<typeof createI18n> = createI18nInstance();
export const i18n: any = createI18nInstance();
// const i18n = createI18n({
//   // 这里是语种的持久化，刷新也存在
//   locale: lang, // 默认是中文
//   fallbackLocale: 'zhCN', // 语言切换的时候是英文
//   globalInjection: true, // 全局配置
//   legacy: false, // vue3写法
//   messages, // 本地message，也就是你需要做国际化的语种
//   silentFallbackWarn: true,
//   silentTranslationWarn: true,
//   missingWarn: false,
//   fallbackWarn: false,
// });

// export default i18n;
