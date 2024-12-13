// vite.config.ts
import path from "path";
import { defineConfig, loadEnv } from "file:///D:/00Development/01MyProject/01%E6%A8%A1%E6%9D%BF/%E6%88%91%E7%9A%84%E6%A8%A1%E6%9D%BF/%E7%9C%9F%E7%9A%84%E6%98%AF%E8%87%AA%E5%B7%B1%E5%81%9A%E7%9A%84/%E8%BF%99%E6%AC%A1%E4%B8%80%E5%AE%9A%E8%A6%81%E5%AE%8C%E6%88%90/vite-vue3-jdm/node_modules/.pnpm/vite@5.4.11_@types+node@20.17.10_sass@1.83.0/node_modules/vite/dist/node/index.js";

// config/vitePlugins.ts
import vue from "file:///D:/00Development/01MyProject/01%E6%A8%A1%E6%9D%BF/%E6%88%91%E7%9A%84%E6%A8%A1%E6%9D%BF/%E7%9C%9F%E7%9A%84%E6%98%AF%E8%87%AA%E5%B7%B1%E5%81%9A%E7%9A%84/%E8%BF%99%E6%AC%A1%E4%B8%80%E5%AE%9A%E8%A6%81%E5%AE%8C%E6%88%90/vite-vue3-jdm/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@5.4.11_@types+node@20.17.10_sass@1.83.0__vue@3.5.13_typescript@5.7.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/00Development/01MyProject/01%E6%A8%A1%E6%9D%BF/%E6%88%91%E7%9A%84%E6%A8%A1%E6%9D%BF/%E7%9C%9F%E7%9A%84%E6%98%AF%E8%87%AA%E5%B7%B1%E5%81%9A%E7%9A%84/%E8%BF%99%E6%AC%A1%E4%B8%80%E5%AE%9A%E8%A6%81%E5%AE%8C%E6%88%90/vite-vue3-jdm/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.1.1_vite@5.4.11_@types+node@20.17.10_sass@1.83.0__vue@3.5.13_typescript@5.7.2_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///D:/00Development/01MyProject/01%E6%A8%A1%E6%9D%BF/%E6%88%91%E7%9A%84%E6%A8%A1%E6%9D%BF/%E7%9C%9F%E7%9A%84%E6%98%AF%E8%87%AA%E5%B7%B1%E5%81%9A%E7%9A%84/%E8%BF%99%E6%AC%A1%E4%B8%80%E5%AE%9A%E8%A6%81%E5%AE%8C%E6%88%90/vite-vue3-jdm/node_modules/.pnpm/unplugin-auto-import@0.17.8_@vueuse+core@10.11.1_vue@3.5.13_typescript@5.7.2___rollup@4.28.1/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/00Development/01MyProject/01%E6%A8%A1%E6%9D%BF/%E6%88%91%E7%9A%84%E6%A8%A1%E6%9D%BF/%E7%9C%9F%E7%9A%84%E6%98%AF%E8%87%AA%E5%B7%B1%E5%81%9A%E7%9A%84/%E8%BF%99%E6%AC%A1%E4%B8%80%E5%AE%9A%E8%A6%81%E5%AE%8C%E6%88%90/vite-vue3-jdm/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.26.3_rollup@4.28.1_vue@3.5.13_typescript@5.7.2_/node_modules/unplugin-vue-components/dist/vite.js";
import { viteMockServe } from "file:///D:/00Development/01MyProject/01%E6%A8%A1%E6%9D%BF/%E6%88%91%E7%9A%84%E6%A8%A1%E6%9D%BF/%E7%9C%9F%E7%9A%84%E6%98%AF%E8%87%AA%E5%B7%B1%E5%81%9A%E7%9A%84/%E8%BF%99%E6%AC%A1%E4%B8%80%E5%AE%9A%E8%A6%81%E5%AE%8C%E6%88%90/vite-vue3-jdm/node_modules/.pnpm/vite-plugin-mock@3.0.2_esbuild@0.23.1_mockjs@1.1.0_vite@5.4.11_@types+node@20.17.10_sass@1.83.0_/node_modules/vite-plugin-mock/dist/index.mjs";
import { NaiveUiResolver } from "file:///D:/00Development/01MyProject/01%E6%A8%A1%E6%9D%BF/%E6%88%91%E7%9A%84%E6%A8%A1%E6%9D%BF/%E7%9C%9F%E7%9A%84%E6%98%AF%E8%87%AA%E5%B7%B1%E5%81%9A%E7%9A%84/%E8%BF%99%E6%AC%A1%E4%B8%80%E5%AE%9A%E8%A6%81%E5%AE%8C%E6%88%90/vite-vue3-jdm/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.26.3_rollup@4.28.1_vue@3.5.13_typescript@5.7.2_/node_modules/unplugin-vue-components/dist/resolvers.js";
import UnoCSS from "file:///D:/00Development/01MyProject/01%E6%A8%A1%E6%9D%BF/%E6%88%91%E7%9A%84%E6%A8%A1%E6%9D%BF/%E7%9C%9F%E7%9A%84%E6%98%AF%E8%87%AA%E5%B7%B1%E5%81%9A%E7%9A%84/%E8%BF%99%E6%AC%A1%E4%B8%80%E5%AE%9A%E8%A6%81%E5%AE%8C%E6%88%90/vite-vue3-jdm/node_modules/.pnpm/unocss@0.63.6_postcss@8.4.49_rollup@4.28.1_typescript@5.7.2_vite@5.4.11_@types+node@20.17.10_sass@1.83.0_/node_modules/unocss/dist/vite.mjs";
var vitePlugins_default = (env) => {
  console.debug("\u{1F680} ~ env:", env);
  const vitePlugins = [
    vue({
      include: [/.vue$/]
    }),
    UnoCSS(),
    vueJsx(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "pinia",
        {
          "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"]
        },
        "@vueuse/core",
        "vue-i18n"
      ],
      // 指定哪些文件应该被自动导入。
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      eslintrc: {
        enabled: true,
        // Default `false`
        filepath: "./.eslintrc-auto-import.json",
        // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true
        // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      dts: "typings/auto-imports.d.ts"
    }),
    Components({
      // dirs 指定组件所在位置，默认为 src/components
      // 可以让我们使用自己定义组件的时候免去 import 的麻烦
      dirs: ["src/components"],
      // 配置需要将哪些后缀类型的文件进行自动按需引入
      extensions: ["vue"],
      // 解析的 UI 组件库，这里以 NaiveUI 为例
      resolvers: [NaiveUiResolver()],
      dts: "typings/components.d.ts"
    }),
    viteMockServe({
      // 模拟服务的文件夹，在设置了configPath后失效
      mockPath: "mock",
      // 是否实时更新
      watchFiles: true,
      // 是否启用
      enable: true,
      // 是否显示日志
      logger: true
    })
  ];
  return vitePlugins;
};

// vite.config.ts
var __vite_injected_original_dirname = "D:\\00Development\\01MyProject\\01\u6A21\u677F\\\u6211\u7684\u6A21\u677F\\\u771F\u7684\u662F\u81EA\u5DF1\u505A\u7684\\\u8FD9\u6B21\u4E00\u5B9A\u8981\u5B8C\u6210\\vite-vue3-jdm";
var vite_config_default = defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, "./env", "VITE");
  return {
    base: viteEnv.VITE_BASE,
    envDir: "./env",
    // 指定环境变量文件目录
    plugins: vitePlugins_default(env),
    resolve: {
      // 设置别名
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "src"),
        "#": path.resolve(__vite_injected_original_dirname, "types")
        // #代替types
      }
    },
    server: {
      host: "0.0.0.0",
      port: 4e3,
      open: false
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
          additionalData: '@use "@/assets/styles/index.scss";',
          // TODO
          silenceDeprecations: ["legacy-js-api"]
          // Dart Sass 2.0.0 将完全移除旧版 API
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiY29uZmlnL3ZpdGVQbHVnaW5zLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcMDBEZXZlbG9wbWVudFxcXFwwMU15UHJvamVjdFxcXFwwMVx1NkEyMVx1Njc3RlxcXFxcdTYyMTFcdTc2ODRcdTZBMjFcdTY3N0ZcXFxcXHU3NzFGXHU3Njg0XHU2NjJGXHU4MUVBXHU1REYxXHU1MDVBXHU3Njg0XFxcXFx1OEZEOVx1NkIyMVx1NEUwMFx1NUI5QVx1ODk4MVx1NUI4Q1x1NjIxMFxcXFx2aXRlLXZ1ZTMtamRtXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFwwMERldmVsb3BtZW50XFxcXDAxTXlQcm9qZWN0XFxcXDAxXHU2QTIxXHU2NzdGXFxcXFx1NjIxMVx1NzY4NFx1NkEyMVx1Njc3RlxcXFxcdTc3MUZcdTc2ODRcdTY2MkZcdTgxRUFcdTVERjFcdTUwNUFcdTc2ODRcXFxcXHU4RkQ5XHU2QjIxXHU0RTAwXHU1QjlBXHU4OTgxXHU1QjhDXHU2MjEwXFxcXHZpdGUtdnVlMy1qZG1cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6LzAwRGV2ZWxvcG1lbnQvMDFNeVByb2plY3QvMDElRTYlQTglQTElRTYlOUQlQkYvJUU2JTg4JTkxJUU3JTlBJTg0JUU2JUE4JUExJUU2JTlEJUJGLyVFNyU5QyU5RiVFNyU5QSU4NCVFNiU5OCVBRiVFOCU4NyVBQSVFNSVCNyVCMSVFNSU4MSU5QSVFNyU5QSU4NC8lRTglQkYlOTklRTYlQUMlQTElRTQlQjglODAlRTUlQUUlOUElRTglQTYlODElRTUlQUUlOEMlRTYlODglOTAvdml0ZS12dWUzLWpkbS92aXRlLmNvbmZpZy50c1wiOy8qXHJcbiAqIEBBdXRob3I6IEpheVxyXG4gKiBARGF0ZTogMjAyNC0wNS0wNiAxMDoyMjo1OFxyXG4gKiBATGFzdEVkaXRvcnM6IGpkbVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDI0LTEwLTE4IDE4OjAyOjM4XHJcbiAqIEBGaWxlUGF0aDogXFx2aXRlLXZ1ZTMtamRtXFx2aXRlLmNvbmZpZy50c1xyXG4gKiBARGVzY3JpcHRpb246XHJcbiAqXHJcbiAqL1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgQ29uZmlnRW52LCBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcclxuXHJcbmltcG9ydCB2aXRlUGx1Z2lucyBmcm9tICcuL2NvbmZpZy92aXRlUGx1Z2lucyc7XHJcblxyXG4vLyBpbXBvcnQgeyBWSVRFX1BPUlQsIFZJVEVfRFJPUF9DT05TT0xFLCBBUElfQkFTRV9VUkwsIEFQSV9UQVJHRVRfVVJMIH0gZnJvbSAnLi9jb25maWcvY29uc3RhbnQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKChlbnY6IENvbmZpZ0VudikgPT4ge1xyXG4gIC8vIFx1NTJBMFx1OEY3RFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlxyXG4gIGNvbnN0IHZpdGVFbnYgPSBsb2FkRW52KGVudi5tb2RlLCAnLi9lbnYnLCAnVklURScpO1xyXG4gIHJldHVybiB7XHJcbiAgICBiYXNlOiB2aXRlRW52LlZJVEVfQkFTRSxcclxuICAgIGVudkRpcjogJy4vZW52JywgLy8gXHU2MzA3XHU1QjlBXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU2NTg3XHU0RUY2XHU3NkVFXHU1RjU1XHJcbiAgICBwbHVnaW5zOiB2aXRlUGx1Z2lucyhlbnYpLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAvLyBcdThCQkVcdTdGNkVcdTUyMkJcdTU0MERcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuICAgICAgICAnIyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICd0eXBlcycpLCAvLyAjXHU0RUUzXHU2NkZGdHlwZXNcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgICBwb3J0OiA0MDAwLFxyXG4gICAgICBvcGVuOiBmYWxzZSxcclxuICAgICAgLy8gaHR0cHM6IGZhbHNlLFxyXG4gICAgICAvLyBwcm94eToge1xyXG4gICAgICAvLyAgICcvYXBpJzoge1xyXG4gICAgICAvLyAgICAgdGFyZ2V0OiAnXHU4OTgxXHU0RUUzXHU3NDA2XHU3Njg0XHU1NzMwXHU1NzQwJyxcclxuICAgICAgLy8gICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgLy8gICAgIHdzOiB0cnVlLFxyXG4gICAgICAvLyAgICAgcmV3cml0ZTogKHBhdGg6IHN0cmluZykgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxyXG4gICAgICAvLyAgIH0sXHJcbiAgICAgIC8vIH0sXHJcbiAgICB9LFxyXG4gICAgY3NzOiB7XHJcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICBzY3NzOiB7XHJcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogJ0B1c2UgXCJAL2Fzc2V0cy9zdHlsZXMvaW5kZXguc2Nzc1wiOycsXHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICBzaWxlbmNlRGVwcmVjYXRpb25zOiBbJ2xlZ2FjeS1qcy1hcGknXSwgLy8gRGFydCBTYXNzIDIuMC4wIFx1NUMwNlx1NUI4Q1x1NTE2OFx1NzlGQlx1OTY2NFx1NjVFN1x1NzI0OCBBUElcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9O1xyXG59KTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFwwMERldmVsb3BtZW50XFxcXDAxTXlQcm9qZWN0XFxcXDAxXHU2QTIxXHU2NzdGXFxcXFx1NjIxMVx1NzY4NFx1NkEyMVx1Njc3RlxcXFxcdTc3MUZcdTc2ODRcdTY2MkZcdTgxRUFcdTVERjFcdTUwNUFcdTc2ODRcXFxcXHU4RkQ5XHU2QjIxXHU0RTAwXHU1QjlBXHU4OTgxXHU1QjhDXHU2MjEwXFxcXHZpdGUtdnVlMy1qZG1cXFxcY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFwwMERldmVsb3BtZW50XFxcXDAxTXlQcm9qZWN0XFxcXDAxXHU2QTIxXHU2NzdGXFxcXFx1NjIxMVx1NzY4NFx1NkEyMVx1Njc3RlxcXFxcdTc3MUZcdTc2ODRcdTY2MkZcdTgxRUFcdTVERjFcdTUwNUFcdTc2ODRcXFxcXHU4RkQ5XHU2QjIxXHU0RTAwXHU1QjlBXHU4OTgxXHU1QjhDXHU2MjEwXFxcXHZpdGUtdnVlMy1qZG1cXFxcY29uZmlnXFxcXHZpdGVQbHVnaW5zLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi8wMERldmVsb3BtZW50LzAxTXlQcm9qZWN0LzAxJUU2JUE4JUExJUU2JTlEJUJGLyVFNiU4OCU5MSVFNyU5QSU4NCVFNiVBOCVBMSVFNiU5RCVCRi8lRTclOUMlOUYlRTclOUElODQlRTYlOTglQUYlRTglODclQUElRTUlQjclQjElRTUlODElOUElRTclOUElODQvJUU4JUJGJTk5JUU2JUFDJUExJUU0JUI4JTgwJUU1JUFFJTlBJUU4JUE2JTgxJUU1JUFFJThDJUU2JTg4JTkwL3ZpdGUtdnVlMy1qZG0vY29uZmlnL3ZpdGVQbHVnaW5zLnRzXCI7LypcclxuICogQEF1dGhvcjogamRtXHJcbiAqIEBEYXRlOiAyMDI0LTA0LTEzIDE1OjQ1OjQyXHJcbiAqIEBMYXN0RWRpdG9yczogamRtXHJcbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjQtMTAtMTggMTg6MDM6MDVcclxuICogQEZpbGVQYXRoOiBcXHZpdGUtdnVlMy1qZG1cXGNvbmZpZ1xcdml0ZVBsdWdpbnMudHNcclxuICogQERlc2NyaXB0aW9uOlxyXG4gKlxyXG4gKi9cclxuLy8gdml0ZVBsdWdpbnMudHNcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnO1xyXG5pbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xyXG5cclxuLy8gXHU4MUVBXHU1MkE4XHU1RjE1XHU1MTY1XHU2M0QyXHU0RUY2XHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnO1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJztcclxuLy8gbW9jayBcdTY3MERcdTUyQTFcclxuaW1wb3J0IHsgdml0ZU1vY2tTZXJ2ZSB9IGZyb20gJ3ZpdGUtcGx1Z2luLW1vY2snO1xyXG4vLyBOYWl2ZSBVSSBcdTc2ODRcdTg5RTNcdTY3OTBcdTU2NjhcclxuaW1wb3J0IHsgTmFpdmVVaVJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJztcclxuLy8gVW5vQ1NTXHJcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xyXG5pbXBvcnQgeyBDb25maWdFbnYgfSBmcm9tICd2aXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IChlbnY6IENvbmZpZ0VudikgPT4ge1xyXG4gIGNvbnNvbGUuZGVidWcoJ1x1RDgzRFx1REU4MCB+IGVudjonLCBlbnYpO1xyXG4gIGNvbnN0IHZpdGVQbHVnaW5zOiAoUGx1Z2luIHwgUGx1Z2luW10pW10gPSBbXHJcbiAgICB2dWUoe1xyXG4gICAgICBpbmNsdWRlOiBbLy52dWUkL10sXHJcbiAgICB9KSxcclxuICAgIFVub0NTUygpLFxyXG4gICAgdnVlSnN4KCksXHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgaW1wb3J0czogW1xyXG4gICAgICAgICd2dWUnLFxyXG4gICAgICAgICd2dWUtcm91dGVyJyxcclxuICAgICAgICAncGluaWEnLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICduYWl2ZS11aSc6IFsndXNlRGlhbG9nJywgJ3VzZU1lc3NhZ2UnLCAndXNlTm90aWZpY2F0aW9uJywgJ3VzZUxvYWRpbmdCYXInXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgICdAdnVldXNlL2NvcmUnLFxyXG4gICAgICAgICd2dWUtaTE4bicsXHJcbiAgICAgIF0sXHJcbiAgICAgIC8vIFx1NjMwN1x1NUI5QVx1NTRFQVx1NEU5Qlx1NjU4N1x1NEVGNlx1NUU5NFx1OEJFNVx1ODhBQlx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1MzAwMlxyXG4gICAgICBpbmNsdWRlOiBbL1xcLlt0al1zeD8kLywgL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLm1kJC9dLFxyXG4gICAgICBlc2xpbnRyYzoge1xyXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsIC8vIERlZmF1bHQgYGZhbHNlYFxyXG4gICAgICAgIGZpbGVwYXRoOiAnLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvbicsIC8vIERlZmF1bHQgYC4vLmVzbGludHJjLWF1dG8taW1wb3J0Lmpzb25gXHJcbiAgICAgICAgZ2xvYmFsc1Byb3BWYWx1ZTogdHJ1ZSwgLy8gRGVmYXVsdCBgdHJ1ZWAsICh0cnVlIHwgZmFsc2UgfCAncmVhZG9ubHknIHwgJ3JlYWRhYmxlJyB8ICd3cml0YWJsZScgfCAnd3JpdGVhYmxlJylcclxuICAgICAgfSxcclxuICAgICAgZHRzOiAndHlwaW5ncy9hdXRvLWltcG9ydHMuZC50cycsXHJcbiAgICB9KSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAvLyBkaXJzIFx1NjMwN1x1NUI5QVx1N0VDNFx1NEVGNlx1NjI0MFx1NTcyOFx1NEY0RFx1N0Y2RVx1RkYwQ1x1OUVEOFx1OEJBNFx1NEUzQSBzcmMvY29tcG9uZW50c1xyXG4gICAgICAvLyBcdTUzRUZcdTRFRTVcdThCQTlcdTYyMTFcdTRFRUNcdTRGN0ZcdTc1MjhcdTgxRUFcdTVERjFcdTVCOUFcdTRFNDlcdTdFQzRcdTRFRjZcdTc2ODRcdTY1RjZcdTUwMTlcdTUxNERcdTUzQkIgaW1wb3J0IFx1NzY4NFx1OUVCQlx1NzBFNlxyXG4gICAgICBkaXJzOiBbJ3NyYy9jb21wb25lbnRzJ10sXHJcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RVx1OTcwMFx1ODk4MVx1NUMwNlx1NTRFQVx1NEU5Qlx1NTQwRVx1N0YwMFx1N0M3Qlx1NTc4Qlx1NzY4NFx1NjU4N1x1NEVGNlx1OEZEQlx1ODg0Q1x1ODFFQVx1NTJBOFx1NjMwOVx1OTcwMFx1NUYxNVx1NTE2NVxyXG4gICAgICBleHRlbnNpb25zOiBbJ3Z1ZSddLFxyXG4gICAgICAvLyBcdTg5RTNcdTY3OTBcdTc2ODQgVUkgXHU3RUM0XHU0RUY2XHU1RTkzXHVGRjBDXHU4RkQ5XHU5MUNDXHU0RUU1IE5haXZlVUkgXHU0RTNBXHU0RjhCXHJcbiAgICAgIHJlc29sdmVyczogW05haXZlVWlSZXNvbHZlcigpXSxcclxuICAgICAgZHRzOiAndHlwaW5ncy9jb21wb25lbnRzLmQudHMnLFxyXG4gICAgfSksXHJcbiAgICB2aXRlTW9ja1NlcnZlKHtcclxuICAgICAgLy8gXHU2QTIxXHU2MkRGXHU2NzBEXHU1MkExXHU3Njg0XHU2NTg3XHU0RUY2XHU1OTM5XHVGRjBDXHU1NzI4XHU4QkJFXHU3RjZFXHU0RTg2Y29uZmlnUGF0aFx1NTQwRVx1NTkzMVx1NjU0OFxyXG4gICAgICBtb2NrUGF0aDogJ21vY2snLFxyXG4gICAgICAvLyBcdTY2MkZcdTU0MjZcdTVCOUVcdTY1RjZcdTY2RjRcdTY1QjBcclxuICAgICAgd2F0Y2hGaWxlczogdHJ1ZSxcclxuICAgICAgLy8gXHU2NjJGXHU1NDI2XHU1NDJGXHU3NTI4XHJcbiAgICAgIGVuYWJsZTogdHJ1ZSxcclxuICAgICAgLy8gXHU2NjJGXHU1NDI2XHU2NjNFXHU3OTNBXHU2NUU1XHU1RkQ3XHJcbiAgICAgIGxvZ2dlcjogdHJ1ZSxcclxuICAgIH0pLFxyXG4gIF07XHJcblxyXG4gIHJldHVybiB2aXRlUGx1Z2lucztcclxufTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQVNBLE9BQU8sVUFBVTtBQUNqQixTQUFvQixjQUFjLGVBQWU7OztBQ0FqRCxPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBSW5CLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBRXZCLFNBQVMscUJBQXFCO0FBRTlCLFNBQVMsdUJBQXVCO0FBRWhDLE9BQU8sWUFBWTtBQUduQixJQUFPLHNCQUFRLENBQUMsUUFBbUI7QUFDakMsVUFBUSxNQUFNLG9CQUFhLEdBQUc7QUFDOUIsUUFBTSxjQUFxQztBQUFBLElBQ3pDLElBQUk7QUFBQSxNQUNGLFNBQVMsQ0FBQyxPQUFPO0FBQUEsSUFDbkIsQ0FBQztBQUFBLElBQ0QsT0FBTztBQUFBLElBQ1AsT0FBTztBQUFBLElBQ1AsV0FBVztBQUFBLE1BQ1QsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxVQUNFLFlBQVksQ0FBQyxhQUFhLGNBQWMsbUJBQW1CLGVBQWU7QUFBQSxRQUM1RTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQSxTQUFTLENBQUMsY0FBYyxVQUFVLGNBQWMsT0FBTztBQUFBLE1BQ3ZELFVBQVU7QUFBQSxRQUNSLFNBQVM7QUFBQTtBQUFBLFFBQ1QsVUFBVTtBQUFBO0FBQUEsUUFDVixrQkFBa0I7QUFBQTtBQUFBLE1BQ3BCO0FBQUEsTUFDQSxLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUE7QUFBQTtBQUFBLE1BR1QsTUFBTSxDQUFDLGdCQUFnQjtBQUFBO0FBQUEsTUFFdkIsWUFBWSxDQUFDLEtBQUs7QUFBQTtBQUFBLE1BRWxCLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQztBQUFBLE1BQzdCLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQTtBQUFBLE1BRVosVUFBVTtBQUFBO0FBQUEsTUFFVixZQUFZO0FBQUE7QUFBQSxNQUVaLFFBQVE7QUFBQTtBQUFBLE1BRVIsUUFBUTtBQUFBLElBQ1YsQ0FBQztBQUFBLEVBQ0g7QUFFQSxTQUFPO0FBQ1Q7OztBRDVFQSxJQUFNLG1DQUFtQztBQWdCekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsUUFBbUI7QUFFOUMsUUFBTSxVQUFVLFFBQVEsSUFBSSxNQUFNLFNBQVMsTUFBTTtBQUNqRCxTQUFPO0FBQUEsSUFDTCxNQUFNLFFBQVE7QUFBQSxJQUNkLFFBQVE7QUFBQTtBQUFBLElBQ1IsU0FBUyxvQkFBWSxHQUFHO0FBQUEsSUFDeEIsU0FBUztBQUFBO0FBQUEsTUFFUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsUUFDbEMsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFVUjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osZ0JBQWdCO0FBQUE7QUFBQSxVQUVoQixxQkFBcUIsQ0FBQyxlQUFlO0FBQUE7QUFBQSxRQUN2QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
