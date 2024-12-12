import { MenuApi } from '@/api';
import { MenuTypeColorMap, MenuTypeOptions } from '@/constants';
import { $t } from '@/locales/i18n';
import { arrayToTree, columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
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
            placeholder: $t('modules.system.role.schema.pleaseInputRoleName'),
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: $t('modules.system.role.schema.pleaseInputRoleName'),
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
            placeholder: $t('modules.system.role.schema.pleaseInputCode'),
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: $t('modules.system.role.schema.pleaseInputCode'),
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
            placeholder: $t('modules.system.role.schema.pleaseInputDescription'),
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
          width: 240,
          fixed: 'right',
          render: (row: any) => (
            <NSpace justify="center">
              <NButton type="success" ghost size="small" onClick={() => methods.handleSetAuth(row)}>
                {$t('modules.system.role.schema.setAuth')}
              </NButton>
              <NButton type="primary" ghost size="small" onClick={() => methods.handleEdit(row)}>
                {$t('common.edit')}
              </NButton>
              {row.code !== 'DEFAULT' ? (
                <NPopconfirm
                  onPositiveClick={() => methods.handleDelete(row)}
                  v-slots={{
                    trigger: () => (
                      <NButton type="error" ghost size="small">
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
      {
        key: 'menu',
        label: $t('modules.system.role.schema.menu'),
        form: {
          component: 'ApiTree',
          componentProps: {
            api: MenuApi.menuList,
            afterRequest: (data: any) => {
              return arrayToTree(data);
            },
            keyField: 'id',
            labelField: 'name',
            renderPrefix: (node: any) => {
              const { option } = node;
              const type = unref(MenuTypeOptions).find((item) => item.value === option.type)?.label;
              return (
                type && (
                  <NTag size="small" type={MenuTypeColorMap[option.type]}>
                    {type}
                  </NTag>
                )
              );
            },
          },
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
  const authFormFields = ['menu'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));

  const authFormSchemas = computed(() => editFormSchemaUtil(schema.value, authFormFields));

  return { columns, formSchemas, editFormSchemas, authFormSchemas };
};
