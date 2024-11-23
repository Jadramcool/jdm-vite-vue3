/*
 * @Author: jdm
 * @Date: 2024-10-23 10:12:39
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-23 10:20:39
 * @FilePath: \vite-vue3-jdm\typings\app.d.ts
 * @Description:
 *
 */
declare namespace App {
  type lang = 'zhCN' | 'enUS';
  // 动画过渡类型
  type TransitionAnimation =
    | ''
    | 'fade-slide'
    | 'fade-bottom'
    | 'fade-scale'
    | 'zoom-fade'
    | 'zoom-out';

  // 定义主题相关的命名空间
  namespace Theme {
    // 定义颜色接口 OtherColor，包含不同状态的颜色值
    interface OtherColor {
      info: string;
      success: string;
      warning: string;
      error: string;
    }

    // 定义主题颜色接口 ThemeColor，继承自 OtherColor，增加主色
    interface ThemeColor extends OtherColor {
      primary: string;
    }

    // 定义主题颜色键的类型，表示 ThemeColor 中的键
    type ThemeColorKey = keyof ThemeColor;

    // 定义主题调色板颜色类型
    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    };

    interface ThemeColorStatus {
      active: string;
      hover: string;
      disabled: string;
      pressed: string;
    }

    type ThemeColorStatusKey = keyof ThemeColorStatus;
  }
}
