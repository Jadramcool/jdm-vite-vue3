import { JayIcon } from '@/components';
import { roleTypeOptions, sexOptions, statusOptions } from '@/constants';
import { $t } from '@/locales/i18n';
import { descriptionSchemaUtil } from '@/utils';
import { NButton, NFlex, NTag } from 'naive-ui';
import { RowData } from 'naive-ui/es/data-table/src/interface';
import { computed, unref } from 'vue';

// 统一配置详情的默认信息展示
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
      },
      {
        key: 'user.username',
        label: $t('common.username'),
        defaultValue: undefined,
        table: {
          fixed: 'left',
          render: (row: RowData) => {
            return (
              <NButton text type="primary" onClick={() => methods.handleDetail(row)}>
                {row.user.username}
              </NButton>
            );
          },
        },
        description: {
          render: (row: RowData) => {
            return <a type="primary">{row.user.username}</a>;
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
        table: {
          width: 120,
          render: (row: RowData) => row.user.phone || '-',
        },
      },
      {
        key: 'user.role',
        label: $t('user.role'),
        defaultValue: undefined,
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
        table: {
          width: 80,
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
        table: {
          width: 80,
          render: (row: RowData) =>
            unref(sexOptions).find((item) => item.value === row.user.sex)?.label,
        },
      },
      {
        key: 'user.status',
        label: $t('common.status'),
        defaultValue: [0, 1],
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
          render: (row: RowData) => `￥${row.registrationFee?.toFixed(2)}` || '-',
        },
        description: {
          span: 2,
        },
      },
      {
        key: 'introduction',
        label: '简介',
        defaultValue: undefined,
        table: {
          width: 150,
          render: (row: RowData) => row.introduction || '-',
          ellipsis: {
            tooltip: true,
          },
        },
        description: {
          span: 2,
        },
      },
      {
        key: 'departmentId',
        label: '所属科室',
        defaultValue: undefined,
        table: {
          render: (row: RowData) => {
            const departmentName = row?.department?.name || '';
            return departmentName ? (
              <NTag bordered={false} type="info" size="small">
                {row.department.name}
              </NTag>
            ) : (
              '-'
            );
          },
        },
      },
    ],
    // 表格/表单统一配置
    setting: {},
  }));

  const descriptionFields = [
    'user.username',
    'user.name',
    'user.phone',
    'user.role',
    'user.sex',
    'user.status',
    'registrationFee',
    'introduction',
  ];

  // 表格列配置

  const descriptionSchemas = computed(() => descriptionSchemaUtil(schema.value, descriptionFields));

  return { descriptionSchemas };
};
