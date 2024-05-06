import { createI18n } from 'vue-i18n';
import en from './lang/en.json';
import zhCN from './lang/zh-CN.json';

// TODO 想改成自动引入的形式
const messages = {
  zhCN: {
    ...zhCN,
  },
  en: {
    ...en,
  },
};

const i18n = createI18n({
  // 这里是语种的持久化，刷新也存在
  locale: localStorage.getItem('lang') || 'zhCN', // 默认是中文
  fallbackLocale: 'zhCN', // 语言切换的时候是英文
  globalInjection: true, // 全局配置
  legacy: false, // vue3写法
  messages, // 本地message，也就是你需要做国际化的语种
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  missingWarn: false,
  fallbackWarn: false,
});

export default i18n;
