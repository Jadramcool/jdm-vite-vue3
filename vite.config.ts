/*
 * @Author: Jay
 * @Date: 2024-05-06 10:22:58
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-18 18:02:38
 * @FilePath: \vite-vue3-jdm\vite.config.ts
 * @Description:
 *
 */
import path from 'path';
import { ConfigEnv, defineConfig, loadEnv } from 'vite';

import vitePlugins from './config/vitePlugins';

// import { VITE_PORT, VITE_DROP_CONSOLE, API_BASE_URL, API_TARGET_URL } from './config/constant';

export default defineConfig((env: ConfigEnv) => {
  // 加载环境变量
  const viteEnv = loadEnv(env.mode, './env', 'VITE');
  return {
    base: viteEnv.VITE_BASE,
    envDir: './env', // 指定环境变量文件目录
    clearScreen: false, // 防止Vite清除终端屏幕，保持地址显示
    plugins: vitePlugins(env),
    resolve: {
      // 设置别名
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '#': path.resolve(__dirname, 'types'), // #代替types
      },
    },
    server: {
      host: '0.0.0.0',
      port: 4000,
      open: false,
      // https: false,
      // proxy: {
      //   '/api': {
      //     target: '要代理的地址',
      //     changeOrigin: true,
      //     ws: true,
      //     rewrite: (path: string) => path.replace(/^\/api/, ''),
      //   },
      // },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/index.scss";',
          // TODO
          silenceDeprecations: ['legacy-js-api'], // Dart Sass 2.0.0 将完全移除旧版 API
        },
      },
    },
  };
});
