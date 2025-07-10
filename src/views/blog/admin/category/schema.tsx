import { JayIcon } from '@/components';
import { $t } from '@/locales/i18n';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton, NFlex, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { computed } from 'vue';

// const locales = (field: string) => $t(`modules.blog.category.${field}`);

export const useCategorySchema = (methods: any = {}) => {
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
        label: $t('modules.blog.category.schema.name'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          query: 'in',
          componentProps: {
            placeholder: $t('modules.blog.category.schema.pleaseInputName'),
          },
        },
        table: {
          align: 'center',
          render: (row: Blog.Category) => {
            return (
              <NFlex justify="center">
                {row.icon && <JayIcon icon={row.icon} />}
                <span style={{ color: row.color || undefined }}>{row.name}</span>
              </NFlex>
            );
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: $t('modules.blog.category.schema.pleaseInputName'),
            },
          ],
        },
      },
      {
        key: 'slug',
        label: $t('modules.blog.category.schema.slug'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: $t('modules.blog.category.schema.pleaseInputSlug'),
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: $t('modules.blog.category.schema.pleaseInputSlug'),
            },
          ],
        },
      },
      {
        key: 'description',
        label: $t('modules.blog.category.schema.description'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: $t('modules.blog.category.schema.pleaseInputDescription'),
          },
        },
        table: {
          width: 200,
          ellipsis: {
            tooltip: true,
          },
          render: (row: Blog.Category) => row.description || '-',
        },
      },
      {
        key: 'parent',
        label: $t('modules.blog.category.schema.parent'),
        defaultValue: undefined,
        table: {
          render: (row: Blog.Category) => {
            return row.parent?.name || '-';
          },
        },
      },
      {
        key: 'postCount',
        label: $t('modules.blog.category.schema.postCount'),
        defaultValue: undefined,
        table: {
          width: 100,
          render: (row: Blog.Category) => {
            return (
              <NTag type="primary" bordered={false} size="small">
                {row.postCount}
              </NTag>
            );
          },
        },
      },
      {
        key: 'sortOrder',
        label: $t('modules.blog.category.schema.sortOrder'),
        defaultValue: undefined,
        form: {
          component: 'NInputNumber',
          componentProps: {
            min: 0,
            step: 1,
            precision: 0,
          },
        },
        table: {
          width: 100,
        },
      },
      {
        key: 'color',
        label: $t('modules.blog.category.schema.color'),
        defaultValue: undefined,
        form: {
          component: 'NColorPicker',
          componentProps: {
            showAlpha: true,
          },
        },
      },
      {
        key: 'icon',
        label: $t('modules.blog.category.schema.icon'),
        defaultValue: undefined,
        form: {
          component: 'IconPicker',
        },
      },
      {
        key: 'createdTime',
        label: $t('common.createdTime'),
        defaultValue: undefined,
        table: {
          render: (row: Blog.Category) => dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'updatedTime',
        label: $t('common.updatedTime'),
        form: {},
        table: {
          render: (row: Blog.Category) => dayjs(row.updatedTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'operate',
        label: $t('common.operate'),
        table: {
          width: 140,
          fixed: 'right',
          render: (row: Blog.Category) => (
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
    // 'parent',
    'postCount',
    'sortOrder',
    // 'createdTime',
    // 'updatedTime',
    'operate',
  ];
  const formFields = ['id', 'name', 'slug', 'description'];
  const editFormFields = ['name', 'slug', 'description', 'color', 'icon', 'sortOrder'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));

  return { columns, formSchemas, editFormSchemas };
};
