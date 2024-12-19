import { RoleApi } from '@/api';
import { JayIcon } from '@/components';
import { $t } from '@/locales/i18n';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
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
  { label: $t('user.roleType.doctor'), value: 'doctor' },
]);

// 表格和表单配置函数
export const useDoctorSchema = (methods: any = {}) => {
  const schema = computed(() => ({
    properties: [
      {
        table: {
          type: 'selection',
          options: ['all', 'none'],
          disabled: (row: RowData) => row.user.username === 'admin',
        },
      },
      {
        key: 'user.id',
        label: $t('common.id'),
        defaultValue: undefined,
        form: {
          component: 'NInputNumber',
          labelMessage: 'ID是用户的唯一标识',
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
      },
      {
        key: 'user.username',
        label: $t('common.username'),
        defaultValue: undefined,
        table: {
          render: (row: RowData) => {
            return (
              <NButton text type="primary" onClick={() => methods.handleDetail(row)}>
                {row.user.username}
              </NButton>
            );
          },
        },
        form: {
          component: 'NInput',
          labelMessage: $t('modules.system.user.schema.usernameTip'),
          query: 'in',
          componentProps: {
            placeholder: $t('modules.system.user.schema.pleaseInputUsername'),
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
                  return new Error($t('modules.system.user.schema.pleaseInputUsername'));
                }
                if (value.length < 2) {
                  return new Error($t('modules.system.user.schema.usernameLengthMinError'));
                }
                if (value.length > 16) {
                  return new Error($t('modules.system.user.schema.usernameLengthMaxError'));
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
        key: 'user.name',
        label: $t('user.name'),
        defaultValue: undefined,
        table: {
          render: (row: RowData) => row.user.name || '-',
        },
        form: {
          component: 'NInput',
          query: 'in',
          componentProps: {},
        },
      },
      {
        key: 'user.phone',
        label: $t('user.phone'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: $t('modules.system.user.schema.pleaseInputPhone'),
            showButton: false,
          },
        },
        table: {
          width: 120,
          render: (row: RowData) => row.user.phone || '-',
        },
      },
      {
        key: 'user.role',
        label: $t('user.role'),
        defaultValue: undefined,
        form: {
          component: 'ApiSelect',
          componentProps: {
            api: RoleApi.getAllRoleList,
            multiple: false,
            placeholder: `${$t('common.pleaseSelect')} ${$t('user.role')}`,
            labelField: 'name',
            valueField: 'id',
            onUpdateValue: (value: any) => {
              console.log(value);
            },
          },
        },
        editForm: {
          componentProps: {
            api: RoleApi.getAllRoleList,
            multiple: true,
            placeholder: `${$t('common.pleaseSelect')} ${$t('user.role')}`,
            labelField: 'name',
            valueField: 'id',
            onUpdateValue: (value: any) => {
              console.log(value);
            },
          },
        },
        table: {
          render: (row: RowData) => {
            const roles = row.user.roles?.map((role: System.Role) => role.name);
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
        key: 'user.roleType',
        label: $t('user.roleTypeName'),
        defaultValue: undefined,
        form: {
          component: 'NSelect',
          componentProps: {
            placeholder: `${$t('common.pleaseSelect')} ${$t('user.roleTypeName')}`,
            options: unref(roleTypeOptions),
          },
        },
        editForm: {
          component: 'NSelect',
          componentProps: {
            options: unref(roleTypeOptions),
            disabled: true,
          },
        },
        table: {
          width: 100,
          render: (row: RowData) => {
            const roleType = unref(roleTypeOptions).find(
              (item) => item.value === row.user.roleType,
            )?.label;
            const color = row.user.roleType === 'admin' ? 'primary' : 'info';
            return (
              <NTag bordered={false} type={color} size="small">
                {roleType}
              </NTag>
            );
          },
        },
      },
      {
        key: 'user.sex',
        label: $t('user.sex'),
        defaultValue: undefined,
        form: {
          component: 'NSelect',
          componentProps: {
            placeholder: `${$t('common.pleaseSelect')} ${$t('user.sex')}`,
            options: unref(sexOptions),
          },
        },
        table: {
          width: 100,
          render: (row: RowData) =>
            unref(sexOptions).find((item) => item.value === row.user.sex)?.label,
        },
      },
      {
        key: 'user.status',
        label: $t('common.status'),
        defaultValue: [0, 1],
        form: {
          component: 'NCheckboxGroup',
          query: 'in',
          componentProps: { placeholder: $t('common.pleaseSelect'), options: unref(statusOptions) },
        },
        editForm: {
          component: 'NRadioGroup',
          defaultValue: 0,
          componentProps: { placeholder: $t('common.pleaseSelect'), options: unref(statusOptions) },
        },
        table: {
          width: 100,
          render: (row: RowData) => {
            const status = unref(statusOptions).find(
              (item) => item.value === row.user.status,
            )?.label;
            const color = row.user.status === 1 ? 'success' : 'warning';
            return (
              <NTag bordered={false} type={color} size="small">
                {status}
              </NTag>
            );
          },
        },
      },
      {
        key: 'registrationFee',
        label: '挂号费',
        defaultValue: undefined,
        table: {
          width: 100,
          render: (row: RowData) => row.registrationFee?.toFixed(2) || '-',
        },
        form: {
          component: 'NInputNumber',
          componentProps: {
            showButton: false,
            min: 0,
            max: 200,
            step: 1,
            precision: 2,
          },
        },
      },
      {
        key: 'introduction',
        label: '简介',
        defaultValue: undefined,
        table: {
          render: (row: RowData) => row.introduction || '-',
          ellipsis: {
            tooltip: true,
          },
        },
        form: {
          component: 'NInput',
          componentProps: { type: 'textarea' },
          query: 'in',
        },
      },
      {
        key: 'user.createdTime',
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
            placeholder: `${$t('common.pleaseSelect')} ${$t('common.createdTime')}`,
          },
        },
        table: {
          width: 200,
          render: (row: RowData) => dayjs(row.user.createdTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'user.updatedTime',
        label: $t('common.updatedTime'),
        form: {
          component: 'NDatePicker',
          componentProps: {
            type: 'daterange',
            defaultTime: ['00:00:00', '23:59:59'],
            placeholder: `${$t('common.pleaseSelect')} ${$t('common.updatedTime')}`,
          },
        },
        table: {
          width: 200,
          render: (row: RowData) => dayjs(row.user.updatedTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'operate',
        label: $t('common.operate'),
        table: {
          fixed: 'right',
          width: 220,
          render: (row: RowData) => (
            <NSpace justify="center">
              <NButton
                type={row.user.status === 1 ? 'warning' : 'primary'}
                ghost
                size="small"
                onClick={() => methods.handleEnable(row)}
              >
                {row.user.status === 0
                  ? $t('modules.system.user.schema.enable')
                  : $t('modules.system.user.schema.disable')}
              </NButton>
              <NButton type="primary" ghost size="small" onClick={() => methods.handleEdit(row)}>
                {$t('common.edit')}
              </NButton>
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
                是否确认删除用户 {row.user.username}？
              </NPopconfirm>
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
    'user.id',
    'user.username',
    'user.name',
    'user.phone',
    'registrationFee',
    'user.roleType',
    'user.role',
    'user.sex',
    'user.status',
    'introduction',
    'user.createdTime',
    'user.updatedTime',
    'operate',
  ];
  const formFields = [
    // 'user.id',
    'user.username',
    'user.phone',
    'user.role',
    'user.sex',
    'user.status',
    'registrationFee',
    'user.createdTime',
    'user.updatedTime',
  ];
  const editFormFields = [
    // 'user.id',
    'user.username',
    'user.name',
    'user.phone',
    'user.role',
    'user.sex',
    'registrationFee',
    'user.status',
    'introduction',
  ];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));

  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));
  return { columns, formSchemas, editFormSchemas };
};
