import { JayIcon } from '@/components';
import { $t } from '@/locales/i18n';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { computed } from 'vue';

// const locales = (field: string) => $t(`modules.blog.tag.${field}`);

export const useTagSchema = (methods: any = {}) => {
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
        key: 'name',
        label: $t('modules.blog.tag.schema.name'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          query: 'in',
          componentProps: {
            placeholder: $t('modules.blog.tag.schema.pleaseInputName'),
          },
        },
        table: {
          align: 'center',
          render: (row: Blog.Tag) => {
            const colorConfig = {
              textColor: row.color,
            };
            return (
              <NTag
                color={colorConfig}
                v-slots={{
                  avatar: () => (row.icon ? <JayIcon icon={row.icon} /> : null),
                }}
              >
                {row.name}
              </NTag>
            );
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: $t('modules.blog.tag.schema.pleaseInputName'),
            },
          ],
        },
      },
      {
        key: 'slug',
        label: $t('modules.blog.tag.schema.slug'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: $t('modules.blog.tag.schema.pleaseInputSlug'),
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: $t('modules.blog.tag.schema.pleaseInputSlug'),
            },
          ],
        },
      },
      {
        key: 'description',
        label: $t('modules.blog.tag.schema.description'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: $t('modules.blog.tag.schema.pleaseInputDescription'),
          },
        },
        table: {
          render: (row: Blog.Tag) => row.description || '-',
        },
      },
      {
        key: 'color',
        label: $t('modules.blog.tag.schema.color'),
        defaultValue: undefined,
        form: {
          component: 'NColorPicker',
          componentProps: {
            showAlpha: false,
          },
        },
        table: {
          width: 100,
          render: (row: Blog.Tag) => {
            return row.color ? (
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: row.color,
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  margin: '0 auto',
                }}
              />
            ) : (
              '-'
            );
          },
        },
      },
      {
        key: 'useCount',
        label: $t('modules.blog.tag.schema.useCount'),
        defaultValue: undefined,
        table: {
          width: 100,
          render: (row: Blog.Tag) => {
            return (
              <NTag type="success" bordered={false} size="small">
                {row.useCount}
              </NTag>
            );
          },
        },
      },
      {
        key: 'createdTime',
        label: $t('common.createdTime'),
        defaultValue: undefined,
        table: {
          width: 180,
          render: (row: Blog.Tag) => dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'updatedTime',
        label: $t('common.updatedTime'),
        form: {},
        table: {
          width: 180,
          render: (row: Blog.Tag) => dayjs(row.updatedTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'operate',
        label: $t('common.operate'),
        table: {
          width: 140,
          fixed: 'right',
          render: (row: Blog.Tag) => (
            <NSpace justify="center">
              <NButton type="info" ghost size="small" onClick={() => methods.handleEdit(row)}>
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
  const tableFields = [
    'id',
    'name',
    'slug',
    'description',
    'color',
    'useCount',
    'createdTime',
    'updatedTime',
    'operate',
  ];
  const formFields = ['name', 'slug', 'description'];
  const editFormFields = ['id', 'name', 'slug', 'description', 'color'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));

  return { columns, formSchemas, editFormSchemas };
};
