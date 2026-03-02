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

  // 解析环境变量
  const { VITE_PORT, VITE_OPEN, VITE_DROP_CONSOLE } = viteEnv;

  return {
    base: viteEnv.VITE_BASE,
    envDir: './env', // 指定环境变量文件目录
    clearScreen: false, // 防止Vite清除终端屏幕，保持地址显示
    plugins: vitePlugins(env, viteEnv),
    resolve: {
      // 设置别名
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '#': path.resolve(__dirname, 'types'), // #代替types
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(VITE_PORT) || 4000,
      open: VITE_OPEN === 'true',
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
          additionalData:
            '@import "@/assets/styles/color.scss"; @import "@/assets/styles/font.scss";',
          // TODO: 移除 legacy-js-api 警告
          silenceDeprecations: ['legacy-js-api'], // Dart Sass 2.0.0 将完全移除旧版 API
        },
      },
    },
    // 依赖预构建优化
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'axios',
        'dayjs',
        'lodash',
        '@vueuse/core',
        'naive-ui',
        '@visactor/vchart',
      ],
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      cssCodeSplit: true, // 启用 CSS 代码拆分
      sourcemap: false, // 生产环境不生成 sourcemap
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // 最小化拆分包
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('naive-ui')) {
                return 'naive-ui';
              }
              if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
                return 'vue-vendor';
              }
              if (id.includes('lodash')) {
                return 'lodash';
              }
              if (id.includes('echarts') || id.includes('vchart')) {
                return 'charts';
              }
              return 'vendor'; // 其他第三方库
            }
          },
          // 静态资源分类打包
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      // 生产环境移除 console
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: VITE_DROP_CONSOLE === 'true',
          drop_debugger: true,
        },
      },
    },
  };
});
