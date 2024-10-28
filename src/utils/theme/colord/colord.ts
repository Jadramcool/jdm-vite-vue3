/**
 * @Author: jdm
 * @Date: 2024-10-23 09:59:17
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-23 09:59:32
 * @FilePath: \vite-vue3-jdm\src\utils\theme\colord\colord.ts
 * @Description: 颜色处理工具
 */

import chroma from 'chroma-js';

/**
 * 检查颜色是否有效
 *
 * @param color - 颜色
 * @returns 如果颜色有效则返回 true
 */
export function isValidColor(color: string) {
  return chroma.valid(color);
}

/**
 * 获取颜色的十六进制表示
 *
 * @param color - 颜色
 * @returns 颜色的十六进制字符串
 */
export function getHex(color: string) {
  return chroma(color).hex();
}

/**
 * 获取颜色的 RGB 表示
 *
 * @param color - 颜色
 * @returns 颜色的 RGB 对象
 */
export function getRgb(color: string) {
  return chroma(color).rgb();
}

/**
 * 获取颜色的 RGBA 表示
 *
 * @param color - 颜色
 * @returns 颜色的 RGBA 对象
 */
export function getRgba(color: string) {
  return chroma(color).rgba();
}

/**
 * 获取颜色的 HSL 表示
 *
 * @param color - 颜色
 * @returns 颜色的 HSL 对象
 */
export function getHsl(color: string) {
  return chroma(color).hsl();
}

/**
 * 获取颜色的 HSV 表示
 *
 * @param color - 颜色
 * @returns 颜色的 HSV 对象
 */
export function getHsv(color: string) {
  return chroma(color).hsv();
}

/**
 * 计算两个颜色之间的 Delta E 值
 *
 * @param color1 - 颜色 1
 * @param color2 - 颜色 2
 * @returns Delta E 值
 */
export function getDeltaE(color1: string, color2: string) {
  return chroma.deltaE(color1, color2);
}

/**
 * 将 HSL 颜色转换为十六进制
 *
 * @param color - HSL 颜色
 * @returns 颜色的十六进制字符串
 */
export function transformHslToHex(color: any) {
  return chroma(color).hex();
}

/**
 * 添加颜色的透明度
 *
 * @param color - 颜色
 * @param alpha - 透明度 (0 - 1)
 * @returns 带透明度的颜色的十六进制字符串
 */
export function addColorAlpha(color: string, alpha: number) {
  return chroma(color).alpha(alpha).hex();
}

/**
 * 混合两种颜色
 *
 * @param firstColor - 第一种颜色
 * @param secondColor - 第二种颜色
 * @param ratio - 第二种颜色的比例 (0 - 1)
 * @returns 混合后的颜色的十六进制字符串
 */
export function mixColor(firstColor: string, secondColor: string, ratio: number) {
  return chroma(firstColor).mix(chroma(secondColor), ratio).hex();
}

/**
 * 将带透明度的颜色转换为相似的不带透明度的颜色
 *
 * @param color - 颜色
 * @param alpha - 透明度 (0 - 1)
 * @param bgColor - 背景颜色 (通常为白色或黑色)
 * @returns 计算后的颜色的十六进制字符串
 */
export function transformColorWithOpacity(color: string, alpha: number, bgColor = '#ffffff') {
  const originColor = addColorAlpha(color, alpha);
  const bgRgba = chroma(bgColor).rgba();

  const rgba = chroma(originColor).rgba();

  const resultRgb = [
    bgRgba[0] + (rgba[0] - bgRgba[0]) * alpha,
    bgRgba[1] + (rgba[1] - bgRgba[1]) * alpha,
    bgRgba[2] + (rgba[2] - bgRgba[2]) * alpha,
  ];

  return chroma(resultRgb, 'rgb').hex();
}

/**
 * 检查颜色是否为白色
 *
 * @param color - 颜色
 * @returns 如果颜色为白色则返回 true
 */
export function isWhiteColor(color: string) {
  return chroma(color).hex() === '#ffffff';
}

export { chroma };
