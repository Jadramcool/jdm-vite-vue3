import { $t } from '@/locales/i18n';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton, NPopconfirm, NSpace } from 'naive-ui';
import { computed } from 'vue';

export const useDepartmentSchema = (methods: any = {}) => {
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
        label: '科室名',
        defaultValue: undefined,
        form: {
          component: 'NInput',
          query: 'in',
          componentProps: {
            placeholder: '请输入科室名',
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: '请输入科室名',
            },
          ],
        },
      },
      {
        key: 'description',
        label: '描述',
        defaultValue: undefined,
        form: {
          component: 'NInput',
        },
        editForm: {
          componentProps: {
            type: 'textarea',
            placeholder: '请输入科室描述',
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
          width: 180,
          fixed: 'right',
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
                是否确认删除科室 {row.name}？
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
  const tableFields = ['id', 'name', 'description', 'createdTime', 'updatedTime', 'operate'];
  const formFields = ['id', 'name'];
  const editFormFields = ['id', 'name', 'description'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));

  return { columns, formSchemas, editFormSchemas };
};
