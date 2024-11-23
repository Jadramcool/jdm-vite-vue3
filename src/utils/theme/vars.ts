/*
 * @Author: jdm
 * @Date: 2024-10-23 10:08:03
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-23 11:20:51
 * @FilePath: \vite-vue3-jdm\src\theme\vars.ts
 * @Description:
 * 该文件用于创建主题颜色变量，提供颜色调色板供组件使用。
 */

/*
 * 创建颜色调色板变量
 * @returns {App.Theme.ThemePaletteColor} 返回包含颜色和状态的调色板对象
 */
const createColorPaletteVars = () => {
  const colors: App.Theme.ThemeColorKey[] = ['primary', 'info', 'success', 'warning', 'error'];
  const colorStatus: App.Theme.ThemeColorStatusKey[] = ['active', 'hover', 'pressed', 'disabled'];

  const colorPaletteVar = {} as App.Theme.ThemePaletteColor;

  colors.forEach((color) => {
    colorPaletteVar[color] = `rgb(var(--${color}-color-rgb))`;
    colorStatus.forEach((status) => {
      colorPaletteVar[`${color}-${status}`] = `rgb(var(--${color}-color-${status}-rgb))`;
    });
  });
  return colorPaletteVar;
};

const colorPaletteVars = createColorPaletteVars();

// 导出主题变量
export const themeVars: any = {
  colors: {
    ...colorPaletteVars,
    light: '#fafafa', // 明亮模式
    dark: '#18181c', // 深色模式
    light_border: '#efeff5', // 明亮模式边框
    dark_border: '#2d2d30', // 深色模式边框
    tips: '#999999', // 提示颜色
  },
};
