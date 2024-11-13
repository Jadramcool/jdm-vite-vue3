import { $t } from '@/locales/i18n';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton, NPopconfirm, NSpace } from 'naive-ui';
import { computed } from 'vue';

export const useRoleSchema = (methods: any = {}) => {
  const schema = computed(() => ({
    properties: [
      {
        table: {
          type: 'selection',
          options: ['all', 'none'],
          disabled: (row: any) => row.code === 'DEFAULT',
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
        table: {
          width: 60,
        },
      },
      {
        key: 'name',
        label: $t('modules.system.role.schema.name'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          query: 'in',
          componentProps: {
            placeholder: `${$t('common.pleaseInput')} ${$t('modules.system.role.schema.name')}`,
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: `${$t('common.pleaseInput')} ${$t('modules.system.role.schema.name')}`,
            },
          ],
        },
      },
      {
        key: 'code',
        label: $t('modules.system.role.schema.code'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: `${$t('common.pleaseInput')} ${$t('modules.system.role.schema.code')}`,
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: `${$t('common.pleaseInput')} ${$t('modules.system.role.schema.code')}`,
            },
          ],
        },
      },
      {
        key: 'description',
        label: $t('modules.system.menu.schema.description'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
        },
        editForm: {
          componentProps: {
            type: 'textarea',
            placeholder: $t('common.pleaseInput') + $t('modules.system.menu.schema.description'),
            maxlength: '50',
            rows: 4,
            showCount: true,
          },
        },
        table: {
          render: (row: any) => row.description || '-',
          ellipsis: {
            tooltip: true,
          },
        },
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
            <NSpace justify="center">
              <NButton type="primary" ghost size="tiny" onClick={() => methods.handleEdit(row)}>
                {$t('common.edit')}
              </NButton>
              {row.code !== 'DEFAULT' ? (
                <NPopconfirm
                  onPositiveClick={() => methods.handleDelete(row)}
                  v-slots={{
                    trigger: () => (
                      <NButton type="error" ghost size="tiny">
                        {$t('common.delete')}
                      </NButton>
                    ),
                  }}
                >
                  是否确认删除用户 {row.username}？
                </NPopconfirm>
              ) : null}
            </NSpace>
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
    'code',
    'name',
    'description',
    'createdTime',
    'updatedTime',
    'operate',
  ];
  const formFields = ['id', 'code', 'name'];
  const editFormFields = ['id', 'code', 'name', 'description'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));
  return { columns, formSchemas, editFormSchemas };
};
