<template>
  <div>
    <!-- <BasicForm></BasicForm> -->
    <JayTable :columns="columns" :request="loadUserList"></JayTable>
  </div>
</template>

<script lang="ts" setup>
import { JayTable } from '@/components/jayTable';
// import { BasicForm } from '@/components/Form';
import { UserManagerApi } from '@/api/system';

defineOptions({ name: 'UserManager' });

onMounted(() => {
  // getUserList();
  // loadUserList();
});

const columns = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: '用户名',
    key: 'username',
  },
  {
    title: '性别',
    key: 'sex',
  },
  {
    title: '创建时间',
    key: 'createdTime',
  },
  {
    title: '更新时间',
    key: 'updatedTime',
  },
];
const params: any = ref({
  pageInfo: { page: 1, pageSize: 3 },
});

const handleParams = (params: any) => {
  return params;
};

const loadUserList = () => {
  return UserManagerApi.userList(handleParams(params.value));
};

// const loadUserList = (res: any) => {
//   return getUserList({ ...res, ...params });
// };
// const getUserList = async (param: any) => {
//   // const res: any = await UserManagerApi.userList({
//   //   // filters: {
//   //   //   username: 'jdm3',
//   //   // },
//   //   pageInfo: { page: 1, pageSize: 3 },
//   // });

//   const res = await UserManagerApi.userList(param);
//   return res;
// };
</script>
