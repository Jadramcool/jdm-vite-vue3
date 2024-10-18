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
import { basePermissions, basePermissions1 } from '@/settings';

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

export async function getPermissions() {
  let asyncPermissions: any = [];
  try {
    let res: any = [];
    if (import.meta.env.VITE_MOCK === 'true') {
      res = await ExampleAPI.mockPermissionAPI();
    } else {
      res = await UserApi.permissionAPI();
    }
    asyncPermissions = res?.data || res || [];
  } catch (error) {
    // console.error(error);
  }

  const res = [...basePermissions, ...asyncPermissions];

  // TODO 返回权限
  return res;
  // return asyncPermissions;
}

export async function getMockPermissions() {
  let asyncPermissions: any = [];
  try {
    const res = await ExampleAPI.mockPermissionAPI();
    asyncPermissions = res?.data || res || [];
  } catch (error) {
    console.error(error);
  }

  const res = [...basePermissions, ...asyncPermissions];

  // TODO 返回权限
  return res;
  // return asyncPermissions;
}

export async function getPermissions1() {
  let asyncPermissions: any = [];
  try {
    const res = await ExampleAPI.mockPermission1API();
    asyncPermissions = res?.data || res || [];
  } catch (error) {
    console.error(error);
  }
  // TODO 返回权限
  return basePermissions1.concat(asyncPermissions);
}
