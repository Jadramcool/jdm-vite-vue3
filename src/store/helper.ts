/*
 * @Author: jdm
 * @Date: 2024-05-30 10:29:46
 * @LastEditors: jdm 1051780106@qq.com
 * @LastEditTime: 2026-01-06 18:21:55
 * @FilePath: \vite-vue3-jdm\src\store\helper.ts
 * @Description:
 *
 */
import { ConfigApi, MenuApi, UserApi } from '@/api';
import { baseMenus } from '@/settings';
import errorHandler from '@/utils/error/ErrorHandler';

export async function getUserInfo() {
  try {
    const res = await UserApi.getUserInfo();

    const userInfo: System.User = res;
    return userInfo;
  } catch (error) {
    errorHandler.handle(error, 'getUserInfo', false);
    return {};
  }
}

export async function getMenus() {
  let asyncMenus: any = [];
  try {
    let res: any = [];
    res = await UserApi.menuAPI();
    asyncMenus = res?.data || res || [];
  } catch (error) {
    errorHandler.handle(error, 'getMenus', false);
  }

  const mergedMenus = new Map();

  // 将 baseMenus 中的对象添加到 Map 中
  baseMenus.forEach((menu) => {
    mergedMenus.set(menu.id, menu);
  });

  // 将 asyncMenus 中的对象添加到 Map 中，若存在相同 id，则覆盖
  asyncMenus.forEach((menu: Recordable) => {
    mergedMenus.set(menu.id, menu);
  });

  // 将最终的结果转换回数组
  const res = Array.from(mergedMenus.values());

  return res;
}

export async function getOnlineMenus() {
  let asyncMenus: any = [];
  try {
    let res: any = [];
    res = await MenuApi.onlineMenu();
    asyncMenus = res?.data || res || [];
  } catch (error) {
    errorHandler.handle(error, 'getOnlineMenus', false);
  }

  const mergedMenus = new Map();

  // 将 baseMenus 中的对象添加到 Map 中
  baseMenus.forEach((menu) => {
    mergedMenus.set(menu.id, menu);
  });

  // 将 asyncMenus 中的对象添加到 Map 中，若存在相同 id，则覆盖
  asyncMenus.forEach((menu: Recordable) => {
    mergedMenus.set(menu.id, menu);
  });

  // 将最终的结果转换回数组
  const res = Array.from(mergedMenus.values());

  return res;
}

export async function getConfig() {
  try {
    const res = await ConfigApi.publicConfig();
    return res || res || {};
  } catch (error) {
    errorHandler.handle(error, 'getConfig', false);
    return {};
  }
}
