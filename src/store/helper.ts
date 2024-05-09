import { basePermissions, basePermissions1 } from '@/settings';
import * as ExampleAPI from '@/api/example';
import * as UserApi from '@/api/user';

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
    console.error(error);
    return {};
  }
}

export async function getPermissions() {
  let asyncPermissions: any = [];
  try {
    let res: any = [];
    console.log(import.meta.env.VITE_MOCK);
    if (import.meta.env.VITE_MOCK) {
      res = await ExampleAPI.mockPremissionAPI();
    } else {
      res = await UserApi.premissionAPI();
    }
    asyncPermissions = res?.data || res || [];
  } catch (error) {
    console.error(error);
  }

  const res = [...basePermissions, ...asyncPermissions];

  // TODO 返回权限
  return res;
  // return asyncPermissions;
}

export async function getMockPermissions() {
  let asyncPermissions: any = [];
  try {
    const res = await ExampleAPI.mockPremissionAPI();
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
    const res = await ExampleAPI.mockPremission1API();
    asyncPermissions = res?.data || res || [];
  } catch (error) {
    console.error(error);
  }
  // TODO 返回权限
  return basePermissions1.concat(asyncPermissions);
}
