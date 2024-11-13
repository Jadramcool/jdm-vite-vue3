import { RoleApi } from '@/api';
import { JayIcon } from '@/components';
import { $t } from '@/locales/i18n';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil, isPhone } from '@/utils';
import dayjs from 'dayjs';
import { FormItemRule, NButton, NFlex, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { RowData } from 'naive-ui/es/data-table/src/interface';
import { computed, unref } from 'vue';

// 性别选项配置
const sexOptions = computed(() => [
  { label: $t('user.male'), value: 'MALE' },
  { label: $t('user.female'), value: 'FEMALE' },
  { label: $t('user.other'), value: 'OTHER' },
]);

// 状态选项配置
const statusOptions = computed(() => [
  { label: $t('user.status.enable'), value: 1 },
  { label: $t('user.status.disable'), value: 0 },
]);

// 角色类型选项配置
const roleTypeOptions = computed(() => [
  { label: $t('user.roleType.admin'), value: 'admin' },
  { label: $t('user.roleType.user'), value: 'user' },
]);

// 表格和表单配置函数
export const useUserSchema = (methods: any = {}) => {
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
        table: {
          type: 'expand',
          renderExpand: (rowData: any) => `${rowData.username} is a good guy.`,
        },
      },
      {
        key: 'id',
        label: $t('common.id'),
        defaultValue: undefined,
        form: {
          component: 'NInputNumber',
          labelMessage: 'ID是用户的唯一标识',
          rules: [
            { required: false, type: 'number', trigger: ['input'], message: '请输入唯一的id' },
          ],
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
        key: 'username',
        label: $t('common.username'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          labelMessage: '用户名也是用户的唯一标识',
          query: 'in',
          componentProps: {
            placeholder: '请输入用户名',
          },
        },
        editForm: {
          rules: [
            {
              type: 'string',
              required: true,
              trigger: ['blur', 'input'],
              validator: (_rule: FormItemRule, value: string) => {
                if (!value) {
                  return new Error('请输入用户名');
                }
                if (value.length < 2) {
                  return new Error('用户名长度不能少于2位');
                }
                if (value.length > 16) {
                  return new Error('用户名长度不能超过16位');
                }
                return true;
              },
            },
          ],
          componentProps: {
            disabled: true,
            maxlength: 16,
            showCount: true,
          },
        },
      },
      {
        key: 'phone',
        label: $t('user.phone'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: '请输入手机号',
            showButton: false,
          },
        },
        editForm: {
          rules: [
            {
              type: 'string',
              required: true,
              trigger: ['blur', 'input'],
              validator: (_rule: FormItemRule, value: string) => {
                if (!value) {
                  return new Error('请输入手机号');
                }
                if (isPhone(value)) {
                  return true;
                }
                return new Error('请输入正确的手机号');
              },
            },
          ],
        },
        table: {
          render: (row: any) => row.phone || '-',
        },
      },
      {
        key: 'role',
        label: $t('user.role'),
        defaultValue: undefined,
        form: {
          component: 'ApiSelect',
          componentProps: {
            api: RoleApi.getAllRoleList,
            multiple: true,
            placeholder: `${$t('common.pleaseSelect')} ${$t('user.role')}`,
            labelField: 'name',
            valueField: 'id',
            onUpdateValue: (value: any) => {
              console.log(value);
            },
            // options: unref(data).roleOptions,
          },
        },
        table: {
          render: (row: RowData) => {
            const roles = row.roles.map((role: System.Role) => role.name);
            return (
              <NFlex>
                {roles.map((role: string, index: number) => (
                  <NTag
                    key={index}
                    bordered={false}
                    type="warning"
                    size="small"
                    v-slots={{
                      icon: () => {
                        return <JayIcon icon={'carbon:user-role'} />;
                      },
                    }}
                  >
                    {role}
                  </NTag>
                ))}
              </NFlex>
            );
          },
        },
      },
      {
        key: 'roleType',
        label: $t('user.roleTypeName'),
        defaultValue: undefined,
        form: {
          component: 'NSelect',
          componentProps: {
            placeholder: `${$t('common.pleaseSelect')} ${$t('user.roleTypeName')}`,
            options: unref(roleTypeOptions),
          },
        },
        table: {
          render: (row: RowData) => {
            const roleType = unref(roleTypeOptions).find(
              (item) => item.value === row.roleType,
            )?.label;
            const color = row.roleType === 'admin' ? 'primary' : 'info';
            return (
              <NTag bordered={false} type={color} size="small">
                {roleType}
              </NTag>
            );
          },
        },
      },
      {
        key: 'sex',
        label: $t('user.sex'),
        defaultValue: undefined,
        form: {
          component: 'NSelect',
          labelMessage: '你是男是女,你不是美国人',
          componentProps: {
            placeholder: `${$t('common.pleaseSelect')} ${$t('user.sex')}`,
            options: unref(sexOptions),
          },
        },
        table: {
          render: (row: any) => unref(sexOptions).find((item) => item.value === row.sex)?.label,
        },
      },
      {
        key: 'status',
        label: $t('common.status'),
        defaultValue: [0, 1],
        form: {
          component: 'NCheckboxGroup',
          query: 'in',
          componentProps: { placeholder: '请选择状态', options: unref(statusOptions) },
        },
        editForm: {
          component: 'NRadioGroup',
          defaultValue: 0,
          componentProps: { placeholder: '请选择状态', options: unref(statusOptions) },
        },
        table: {
          render: (row: RowData) => {
            const status = unref(statusOptions).find((item) => item.value === row.status)?.label;
            const color = row.status === 1 ? 'success' : 'warning';
            return (
              <NTag bordered={false} type={color} size="small">
                {status}
              </NTag>
            );
          },
        },
      },
      {
        key: 'createdTime',
        label: $t('common.createdTime'),
        defaultValue: undefined,
        form: {
          defaultValue: [
            dayjs('2024-01-01 00:00:00').valueOf(),
            dayjs('2024-12-31 23:59:59').valueOf(),
          ],
          component: 'NDatePicker',
          componentProps: {
            type: 'daterange',
            defaultTime: '12:00:00',
            placeholder: `${$t('common.pleaseSelect')} ${$t('common.createdTime')}`,
          },
        },
        table: {
          render: (row: any) => dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'updatedTime',
        label: $t('common.updatedTime'),
        form: {
          component: 'NDatePicker',
          componentProps: {
            type: 'daterange',
            placeholder: `${$t('common.pleaseSelect')} ${$t('common.updatedTime')}`,
          },
        },
        table: {
          render: (row: any) => dayjs(row.updatedTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'operate',
        label: $t('common.operate'),
        table: {
          render: (row: RowData) => (
            <NSpace justify="center">
              <NButton
                type={row.status === 1 ? 'error' : 'primary'}
                ghost
                size="tiny"
                onClick={() => methods.handleEnable(row)}
              >
                {row.status === 0
                  ? $t('modules.system.user.schema.enable')
                  : $t('modules.system.user.schema.disable')}
              </NButton>
              <NButton type="primary" ghost size="tiny" onClick={() => methods.handleEdit(row)}>
                {$t('common.edit')}
              </NButton>
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
            </NSpace>
          ),
        },
      },
    ],
    // 表格/表单统一配置
    setting: {
      table: { resizable: true },
    },
  }));

  // 表格和表单字段
  const tableFields = [
    'id',
    'username',
    'phone',
    'roleType',
    'role',
    'sex',
    'status',
    'createdTime',
    'updatedTime',
    'operate',
  ];
  const formFields = [
    'id',
    'username',
    'phone',
    'roleType',
    'role',
    'sex',
    'status',
    'createdTime',
    'updatedTime',
  ];
  const editFormFields = ['id', 'username', 'phone', 'roleType', 'role', 'sex', 'status'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));

  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));
  return { columns, formSchemas, editFormSchemas };
};
