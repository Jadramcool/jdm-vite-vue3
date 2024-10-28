<!--
 * @Author: Jay
 * @Date: 2024-05-30 10:29:46
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-28 11:26:36
 * @FilePath: \vite-vue3-jdm\src\views\system\user\index.vue
 * @Description: 
 * 
-->
<template>
  <div>
    <JayTable
      :title="$t('table.userList')"
      :columns="columns"
      :request="loadUserList"
      :rowKey="(row:NaiveUI.RowData)=>row.id"
      :pagination="{ pageSize: 10 }"
      @update:checked-row-keys="handleCheck"
    ></JayTable>
  </div>
</template>

<script lang="tsx" setup>
import { UserManagerApi } from '@/api/system';
import { JayTable } from '@/components/jayTable';
import { columnsUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton } from 'naive-ui';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserManager' });

const { t } = useI18n();

// 表格/表单配置  采用computed（适配i18n）
// table的type为selection时，表格需要传rowKey
const schema = computed(() => ({
  properties: [
    {
      table: {
        type: 'selection',
        options: ['all', 'none'],
        disabled(row: any) {
          return row.username === 'admin';
        },
      },
    },
    {
      table: {
        type: 'expand',
        renderExpand: (rowData: any) => {
          return `${rowData.username} is a good guy.`;
        },
      },
    },
    {
      key: 'id',
      label: t('common.id'),
    },
    {
      key: 'username',
      label: t('common.username'),
    },
    {
      key: 'sex',
      label: t('user.sex'),
    },
    {
      key: 'createdTime',
      label: t('common.createdTime'),
      defaultValue: undefined,
      form: {},
      table: {
        render: (row: any) => dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss'),
      },
    },
    {
      key: 'updatedTime',
      label: t('common.updatedTime'),
      form: {},
      table: {
        render: (row: any) => dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss'),
      },
    },
    {
      key: 'operate',
      label: t('common.operate'),
      table: {
        render: () => {
          return (
            <NButton type="primary" ghost size="small">
              {t('common.edit')}
            </NButton>
          );
        },
      },
    },
  ],
  setting: {
    table: {
      resizable: true,
    },
  },
}));
// 表格展示字段
const tableFields: string[] = ['id', 'username', 'sex', 'createdTime', 'updatedTime', 'operate'];

// 表格列配置，采用computed（适配i18n）
const columns = computed(() => {
  return columnsUtil(schema.value, tableFields);
});

onMounted(() => {
  // getUserList();
  // loadUserList();
});

const params = ref<Query.GetParams>({
  filters: {
    // username_in: '1',
    // username_not_in: 'jdm',
    // sex: 'OTHER',
  },
});

const handleParams = (params: any) => {
  return params;
};

const loadUserList = async (data: any) => {
  // console.log(handleParams(params.value));
  // return UserManagerApi.userList(handleParams(params.value));
  return UserManagerApi.userList({ ...data, ...handleParams(params.value) });
};

const handleCheck = (keys: Array<string | number>, rows: object[]) => {
  console.log(keys, rows);
};
</script>
