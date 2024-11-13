/*
 * @Author: jdm
 * @Date: 2024-05-30 10:29:46
 * @LastEditors: jdm
 * @LastEditTime: 2024-09-24 13:29:37
 * @FilePath: \vite-vue3-jdm\src\store\helper.ts
 * @Description:
 *
 */
import * as ExampleAPI from '@/api/example';
import * as UserApi from '@/api/user';
import { baseMenus } from '@/settings';

export async function getUserInfo() {
  try {
    const res = await UserApi.getUserInfo();
    const { id, username, profile, roles, currentRole } = res || {};
    return {
      id,
      username,
      avatar: profile?.avatar,
      nickName: profile?.nickName,
      gender: profile?.gender,
      address: profile?.address,
      email: profile?.email,
      roles,
      currentRole,
    };
  } catch (error) {
    // console.error(error);
    return {};
  }
}

export async function getMenus() {
  let asyncMenus: any = [];
  try {
    let res: any = [];
    if (import.meta.env.VITE_MOCK === 'true') {
      res = await ExampleAPI.mockPermissionAPI();
    } else {
      res = await UserApi.menuAPI();
    }
    asyncMenus = res?.data || res || [];
  } catch (error) {
    console.error(error);
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
