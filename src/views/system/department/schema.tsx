import { DepartmentApi, UserManagerApi } from '@/api';

import { $t } from '@/locales/i18n';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { computed } from 'vue';

export const useDepartmentSchema = (methods: any = {}) => {
  const schema = computed(() => ({
    properties: [
      {
        key: 'id',
        label: $t('common.id'),
        defaultValue: undefined,
        table: {
          align: 'left',
        },
        form: {
          component: 'NInputNumber',
          componentProps: {
            showButton: false,
            min: 1,
            step: 1,
            precision: 0,
          },
        },
      },
      {
        key: 'name',
        label: $t('modules.system.department.schema.name'),
        defaultValue: undefined,
        table: {
          render: (row: any) => {
            const getTagColorByLevel = (
              level: number,
            ): 'info' | 'success' | 'warning' | 'error' | 'primary' | 'default' => {
              const colorMap: Record<
                number,
                'info' | 'success' | 'warning' | 'error' | 'primary' | 'default'
              > = {
                1: 'info', // 一级部门 - 蓝色
                2: 'success', // 二级部门 - 绿色
                3: 'warning', // 三级部门 - 橙色
                4: 'error', // 四级部门 - 红色
                5: 'primary', // 五级部门 - 主色
                6: 'default', // 六级部门 - 默认色
              };
              return colorMap[level] || 'default'; // 默认颜色
            };

            return (
              <NTag size="small" type={getTagColorByLevel(row.level)}>
                {row.name}
              </NTag>
            );
          },
        },
        form: {
          component: 'NInput',
          query: 'in',
          componentProps: {
            placeholder: '请输入部门名称',
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: '请输入部门名称',
            },
          ],
        },
      },
      {
        key: 'code',
        label: '部门编码',
        defaultValue: undefined,
        form: {
          component: 'NInput',
          query: 'in',
          componentProps: {
            placeholder: '请输入部门编码',
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: '请输入部门编码',
            },
          ],
        },
      },
      {
        key: 'description',
        label: '部门描述',
        defaultValue: undefined,
        table: {
          render: (row: any) => row.description || '-',
          ellipsis: {
            tooltip: true,
          },
        },
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: '请输入部门描述',
            type: 'textarea',
          },
        },
        editForm: {
          giProps: {
            span: 24,
          },
        },
      },
      {
        key: 'level',
        label: '级别',
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
      },
      {
        key: 'status',
        label: '状态',
        defaultValue: undefined,

        table: {
          render: (row: any) => {
            const status = [
              { label: '启用', value: 1 },
              { label: '停用', value: 0 },
            ].find((item) => item.value === row.status)?.label;
            return status ? (
              <NTag size="small" type={row.status === 1 ? 'success' : 'error'}>
                {status}
              </NTag>
            ) : (
              '-'
            );
          },
        },

        form: {
          component: 'NSelect',
          componentProps: {
            options: [
              {
                label: '启用',
                value: 1,
              },
              {
                label: '停用',
                value: 0,
              },
            ],
          },
        },
        editForm: {
          rules: [
            {
              type: 'number',
              required: true,
              message: '请选择状态',
              trigger: ['change'],
            },
          ],
        },
      },
      {
        key: 'managerId',
        label: '负责人',
        defaultValue: undefined,
        form: {
          component: 'ApiSelect',
          componentProps: {
            api: UserManagerApi.userList,
            labelField: 'name',
            valueField: 'id',
            placeholder: $t('common.pleaseSelect'),
            clearable: true,
            filterable: true,
          },
        },
      },
      {
        key: 'parentId',
        label: '父级部门',
        defaultValue: undefined,
        form: {
          component: 'ApiTreeSelect',
          componentProps: {
            api: DepartmentApi.getDepartmentTree,
            labelField: 'name',
            keyField: 'id',
            placeholder: $t('common.pleaseSelect'),
            defaultExpandAll: true,
          },
        },
      },
      {
        key: 'parent',
        label: '父级部门',

        defaultValue: undefined,
      },
      {
        key: 'manager',
        label: '负责人',
        defaultValue: undefined,
        table: {
          render: (row: any) => row.manager?.name || '-',
        },
      },
      {
        key: 'sortOrder',
        label: '排序',
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
      },
      {
        key: 'memberCount',
        label: '成员数量',
        defaultValue: undefined,
      },
      {
        key: 'childrenCount',
        label: '子部门数量',
        defaultValue: undefined,
      },
      {
        key: 'createdTime',
        label: $t('common.createdTime'),
        defaultValue: undefined,
        table: {
          width: 200,
          render: (row: any) => dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'updatedTime',
        label: $t('common.updatedTime'),
        form: {},
        table: {
          width: 200,
          render: (row: any) => dayjs(row.updatedTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'operate',
        label: $t('common.operate'),
        table: {
          fixed: 'right',
          width: 140,
          render: (row: any) => (
            <NSpace justify="center">
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
                是否确认删除部门 {row.name}？
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
    'id',
    'name',
    'code',
    'description',
    'level',
    'status',
    'manager',
    'memberCount',
    'childrenCount',
    'createdTime',
    'operate',
  ];
  const formFields = ['id', 'name'];
  const editFormFields = [
    'name',
    'code',
    'parentId',
    'status',
    'managerId',
    'sortOrder',
    'description',
  ];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));

  return { columns, formSchemas, editFormSchemas };
};
