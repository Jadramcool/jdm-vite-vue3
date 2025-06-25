import { resourceU3C3TypeOptions, resourceU3C3TypeColorType } from '@/constants';
import { $t } from '@/locales/i18n';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { toLower } from 'lodash';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { computed } from 'vue';

const locales = (field: string) => $t(`modules.resource.u3c3.${field}`);

export const useResourceSchema = (methods: any = {}) => {
  const schema = computed(() => ({
    properties: [
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
        table: {
          width: 80,
        },
        editForm: {
          componentProps: {
            showButton: false,
            disabled: true,
          },
        },
      },
      {
        key: 'type',
        label: $t('modules.notice.notice.schema.type'),
        table: {
          render: (row: any) => {
            console.log('🚀 ~ schema ~ row:', row.type);
            return (
              <NTag type={resourceU3C3TypeColorType[row.type]} bordered={false} size="small">
                {locales(`typeMap.${toLower(row.type)}`)}
              </NTag>
            );
          },
        },
        form: {
          component: 'NSelect',
          componentProps: {
            options: unref(resourceU3C3TypeOptions),
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: `${$t('common.pleaseSelect')}`,
            },
          ],
        },
      },
      {
        key: 'title',
        label: $t('modules.resource.u3c3.schema.title'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          query: 'in',
          componentProps: {
            placeholder: $t('modules.resource.u3c3.schema.pleaseInputTitle'),
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: $t('modules.resource.u3c3.schema.pleaseInputTitle'),
            },
          ],
        },
      },
      {
        key: 'author',
        label: $t('modules.notice.notice.schema.author'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
        },
        table: {
          render: (row: Notice.Notice) => row.author?.name || row.author?.username || '-',
        },
      },
      {
        key: 'createdTime',
        label: $t('common.createdTime'),
        defaultValue: undefined,
        table: {
          // width: '180',
          render: (row: Notice.Notice) => dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'updatedTime',
        label: $t('common.updatedTime'),
        form: {},
        table: {
          // width: '180',
          render: (row: Notice.Notice) => dayjs(row.updatedTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'operate',
        label: $t('common.operate'),
        table: {
          width: 200,
          fixed: 'right',
          render: (row: Notice.Notice) => (
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
                {$t('common.phrase.confirmDelete')}?
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
  const tableFields = ['id', 'type', 'title', 'author', 'createdTime', 'updatedTime', 'operate'];
  const formFields = ['id', 'type', 'title'];
  const editFormFields = ['id', 'title', 'type'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));

  return { columns, formSchemas, editFormSchemas };
};
