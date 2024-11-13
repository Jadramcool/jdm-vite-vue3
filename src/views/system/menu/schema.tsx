import { $t } from '@/locales/i18n';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton } from 'naive-ui';
import { computed } from 'vue';

export const useMenuSchema = (methods: any = {}) => {
  const schema = computed(() => ({
    properties: [
      {
        table: {
          type: 'selection',
          options: ['all', 'none'],
          disabled: (row: any) => row.username === 'admin',
        },
      },
      {
        key: 'id',
        label: $t('common.id'),
        defaultValue: undefined,
        form: {
          component: 'NInputNumber',
          componentProps: {
            placeholder: '请输入ID',
            showButton: false,
            min: 1,
            step: 1,
            precision: 0,
          },
        },
        editForm: {
          componentProps: {
            showButton: false,
            disabled: true,
          },
        },
      },
      {
        key: 'name',
        label: $t('modules.system.menu.schema.name'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          query: 'in',
          rules: [
            {
              required: false,
              message: `${$t('common.pleaseInput')} ${$t('modules.system.menu.schema.name')}`,
            },
          ],
          componentProps: { placeholder: '请输入用户名' },
        },
      },
      {
        key: 'code',
        label: $t('modules.system.menu.schema.code'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          query: 'in',
          componentProps: { placeholder: '请输入权限码' },
        },
      },
      {
        key: 'description',
        label: $t('modules.system.menu.schema.description'),
        defaultValue: undefined,
        table: {
          render: (row: any) => row.description || '-',
        },
      },
      {
        key: 'path',
        label: $t('modules.system.menu.schema.path'),
        defaultValue: undefined,
      },
      {
        key: 'layout',
        label: $t('modules.system.menu.schema.layout'),
        defaultValue: undefined,
      },
      {
        key: 'pid',
        label: '父id',
        defaultValue: undefined,
      },
      {
        key: 'createdTime',
        label: $t('common.createdTime'),
        defaultValue: undefined,
        form: {
          component: 'NRadio',
          labelMessage: '用户名也是用户的唯一标识',
          rules: [{ required: false, trigger: ['blur', 'input'] }],
          componentProps: { placeholder: '请输入用户名' },
        },
        table: {
          render: (row: any) => dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'updatedTime',
        label: $t('common.updatedTime'),
        form: {},
        table: {
          render: (row: any) => dayjs(row.updatedTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'operate',
        label: $t('common.operate'),
        table: {
          render: (row: any) => (
            <NButton type="primary" ghost size="small" onClick={() => methods.handleEdit(row)}>
              {$t('common.edit')}
            </NButton>
          ),
        },
      },
    ],
    // 表格/表单统一配置
    setting: {},
  }));

  // 表格和表单字段
  const tableFields = [
    'id',
    'name',
    'code',
    'path',
    'layout',
    'description',
    'createdTime',
    'updatedTime',
    'operate',
  ];
  const formFields = ['id', 'name', 'status'];
  const editFormFields = ['id', 'name', 'status'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));
  return { columns, formSchemas, editFormSchemas };
};
