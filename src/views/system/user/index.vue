<!--
 * @Author: Jay
 * @Date: 2024-05-30 10:29:46
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-31 17:04:41
 * @FilePath: \vite-vue3-jdm\src\views\system\user\index.vue
 * @Description: 
 * 
-->
<template>
  <div>
    <NCard title="搜索表格" size="small">
      <BasicForm @register="register" @submit="handleSubmit" ref="formRef"> </BasicForm>
    </NCard>

    <BasicTable
      ref="tableRef"
      :title="$t('table.userList')"
      :columns="columns"
      :filters="queryParams"
      :request="loadUserList"
      :rowKey="(row: NaiveUI.RowData) => row.id"
      :pagination="{ pageSize: 10 }"
      @update:checked-row-keys="handleCheck"
    ></BasicTable>
  </div>
</template>

<script lang="tsx" setup>
import { UserManagerApi } from '@/api/system';
import { BasicForm, BasicTable, useForm } from '@/components';
import { columnsUtil, formSchemaUtil } from '@/utils';
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
      defaultValue: undefined,
      form: {
        component: 'NInputNumber',
        labelMessage: 'ID是用户的唯一标识',
        rules: [
          {
            required: false,
            type: 'number', // 数字类型一定要加上，否则会报错
            trigger: ['input'],
            message: '请输入唯一的id',
          },
        ],
        componentProps: {
          placeholder: '请输入ID',
          showButton: false,
          min: 1,
          step: 1,
          precision: 0,
        },
      },
    },
    {
      key: 'username',
      label: t('common.username'),
      defaultValue: undefined,
      form: {
        component: 'NInput',
        labelMessage: '用户名也是用户的唯一标识',
        query: 'in',
        rules: [
          {
            required: false,
            message: '请输入用户名',
          },
        ],
        componentProps: {
          placeholder: '请输入用户名',
        },
      },
    },
    {
      key: 'sex',
      label: t('user.sex'),
      defaultValue: undefined,
      form: {
        component: 'NSelect',
        labelMessage: '你是男是女,你不是美国人',
        componentProps: {
          placeholder: '请选择性别',
          options: [
            { label: t('user.male'), value: 'MALE' },
            { label: t('user.female'), value: 'FEMALE' },
            { label: t('user.other'), value: 'OTHER' },
          ],
        },
      },
    },
    {
      key: 'status',
      label: t('common.status'),
      defaultValue: [0, 1],
      form: {
        component: 'NCheckboxGroup',
        query: 'in',
        componentProps: {
          placeholder: '请选择状态',
          options: [
            { label: t('user.status.enable'), value: 1 },
            { label: t('user.status.disable'), value: 0 },
          ],
        },
      },
      table: {
        render: (row: any) => {
          return row.status === 1 ? t('user.status.enable') : t('user.status.disable');
        },
      },
    },
    // {
    //   key: 'status',
    //   label: t('common.status'),
    //   defaultValue: undefined,
    //   form: {
    //     component: 'NRadioGroup',
    //     componentProps: {
    //       placeholder: '请选择状态',
    //       options: [
    //         { label: t('user.status.enable'), value: true },
    //         { label: t('user.status.disable'), value: false },
    //       ],
    //     },
    //   },
    // },
    {
      key: 'createdTime',
      label: t('common.createdTime'),
      defaultValue: undefined,
      form: {
        component: 'NRadio',
        labelMessage: '用户名也是用户的唯一标识',
        rules: [{ required: false, trigger: ['blur', 'input'] }],
        componentProps: {
          placeholder: '请输入用户名',
        },
      },
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
const tableFields: string[] = [
  'id',
  'username',
  'sex',
  'status',
  'createdTime',
  'updatedTime',
  'operate',
];
const formFields: string[] = ['id', 'username', 'sex', 'status'];
const tableRef = ref<any>(null);
const formRef = ref<any>(null);

// 表格列配置，采用computed（适配i18n）
const columns = computed(() => {
  return columnsUtil(schema.value, tableFields);
});

const formSchemas = computed(() => {
  return formSchemaUtil(schema.value, formFields);
});

// const { columns, formSchemas }: any = computed(() => {
//   return {
//     columns: ref(columnsUtil(schema.value, tableFields)),
//     formSchemas: ref(formSchemaUtil(schema.value, formFields)),
//   };
// });

onMounted(() => {
  // getUserList();
  // loadUserList();
});

const [register, { getFieldsValue }] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  schemas: formSchemas,
  submitOnReset: true,
});

// 请求参数
const queryParams = ref<Query.GetParams>({});

// 表单提交
const handleSubmit = (data: any) => {
  data && tableRef.value.reload();
};

// 表格数据请求
const loadUserList = async (data: Query.GetParams) => {
  data.filters = { ...(data.filters || {}), ...getFieldsValue() };
  return UserManagerApi.userList(data);
};

const handleCheck = (keys: Array<string | number>, rows: object[]) => {
  console.log(keys, rows);
};
</script>
