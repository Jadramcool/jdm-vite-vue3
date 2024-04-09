import { basePermissions } from '@/settings';
import * as ExampleAPI from '@/api/example';

export async function getUserInfo() {
  const res = await ExampleAPI.mockGetUserInfoAPI();
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
}

export async function getPermissions() {
  let asyncPermissions: any = [];
  try {
    const res = await ExampleAPI.mockPremissionAPI();
    asyncPermissions = res?.data || res || [];
  } catch (error) {
    console.error(error);
  }
  // TODO 返回权限
  // return basePermissions.concat(asyncPermissions);
  return asyncPermissions;
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
  return basePermissions.concat(asyncPermissions);
}
