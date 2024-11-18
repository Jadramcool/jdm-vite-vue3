import { MenuApi } from '@/api';
import { layoutOptions, MenuTypeColorMap, MenuTypeOptions } from '@/constants';
import { $t } from '@/locales/i18n';
import { arrayToTree, columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { toLower } from 'lodash';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { computed } from 'vue';

// 页面布局

const locales = (field: string) => $t(`modules.system.menu.${field}`);

// 是否显示
const showOptions = computed(() => [
  { label: $t('common.yes'), value: true },
  { label: $t('common.no'), value: false },
]);

export const useMenuSchema = (methods: any = {}) => {
  const schema = computed(() => ({
    properties: [
      // {
      //   table: {
      //     type: 'selection',
      //     options: ['all', 'none'],
      //   },
      // },
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
      },
      {
        key: 'name',
        label: $t('modules.system.menu.schema.name'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          query: 'in',
          componentProps: {
            placeholder: `${$t('common.pleaseInput')} ${$t('modules.system.menu.schema.name')}`,
          },
        },
        editForm: {
          defaultValue: '1',
          rules: [
            {
              required: true,
              message: `${$t('common.pleaseInput')} ${$t('modules.system.menu.schema.name')}`,
            },
          ],
        },
      },
      {
        key: 'code',
        label: $t('modules.system.menu.schema.code'),
        defaultValue: undefined,
        form: {
          component: 'NInput',
          query: 'in',
          componentProps: {
            placeholder: `${$t('common.pleaseInput')} ${$t('modules.system.menu.schema.code')}`,
          },
        },
        editForm: {
          defaultValue: '1',
          rules: [
            {
              required: true,
              message: `${$t('common.pleaseInput')} ${$t('modules.system.menu.schema.code')}`,
            },
          ],
        },
      },
      {
        key: 'description',
        label: $t('modules.system.menu.schema.description'),
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
            placeholder: `${$t('common.pleaseInput')} ${$t('modules.system.menu.schema.description')}`,
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
        key: 'path',
        label: $t('modules.system.menu.schema.path'),
        defaultValue: undefined,
        table: {
          render: (row: any) => row.path || '-',
        },
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: `${$t('common.pleaseInput')} ${$t('modules.system.menu.schema.path')}`,
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: `${$t('common.pleaseInput')} ${$t('modules.system.menu.schema.path')}`,
            },
          ],
          ifShow: ({ values }: any) => {
            if (values.type === 'BUTTON') {
              return false;
            }
            return true;
          },
        },
      },
      {
        key: 'layout',
        label: $t('modules.system.menu.schema.layout'),
        defaultValue: undefined,
        table: {
          render: (row: any) => {
            const layout =
              unref(layoutOptions).find((item) => item.value === row.layout)?.label || '-';
            return (
              <NTag bordered={false} size="small">
                {layout}
              </NTag>
            );
          },
        },
        form: {
          component: 'NSelect',
          defaultValue: 'normal',
          componentProps: {
            options: unref(layoutOptions),
          },
        },
        editForm: {
          ifShow: ({ values }: any) => {
            if (values.type === 'BUTTON') {
              return false;
            }
            return true;
          },
        },
      },
      {
        key: 'pid',
        label: $t('modules.system.menu.schema.pid'),
        defaultValue: undefined,
        form: {
          component: 'ApiTreeSelect',
          componentProps: {
            api: MenuApi.menuList,
            labelField: 'name',
            keyField: 'id',
            placeholder: `${$t('common.pleaseSelect')} ${$t('modules.system.menu.schema.pid')}`,
            afterRequest: (data: any) => {
              return arrayToTree(data);
            },
          },
        },
        editForm: {
          labelMessage: '不选默认为顶级',
        },
      },
      {
        key: 'status',
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
          fixed: 'right',
          width: 200,
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
                是否确认删除菜单 {row.name}？
              </NPopconfirm>
            </NSpace>
          ),
        },
      },
      // 新增编辑额外表单项
      {
        key: 'type',
        label: $t('modules.system.menu.schema.type'),
        table: {
          render: (row: any) => {
            return (
              <NTag type={MenuTypeColorMap[row.type]} bordered={false} size="small">
                {locales(`typeMap.${toLower(row.type)}`)}
              </NTag>
            );
          },
        },
        form: {},
        editForm: {
          component: 'NRadioGroup',
          defaultValue: 'MENU',
          rules: [
            {
              required: true,
              message: `${$t('common.pleaseSelect')} ${$t('modules.system.menu.schema.type')}`,
            },
          ],
          componentProps: {
            options: unref(MenuTypeOptions),
          },
        },
      },
      {
        key: 'redirect',
        label: $t('modules.system.menu.schema.redirect'),
        form: {
          component: 'NInput',
        },
        editForm: {
          ifShow: ({ values }: any) => {
            if (values.type === 'BUTTON') {
              return false;
            }
            return true;
          },
        },
      },
      {
        key: 'show',
        label: $t('modules.system.menu.schema.show'),
        form: {
          component: 'NRadioGroup',
          defaultValue: true,
          componentProps: {
            options: unref(showOptions),
          },
        },
      },
      {
        key: 'component',
        label: $t('modules.system.menu.schema.component'),
        table: {
          render: (row: NaiveUI.RowData) => row.component || '-',
        },
        form: {
          component: 'NInput',
        },
        editForm: {
          rules: [
            {
              required: false,
              message: `${$t('common.pleaseInput')} ${$t('modules.system.menu.schema.component')}`,
            },
          ],
          ifShow: ({ values }: any) => {
            if (values.type === 'BUTTON') {
              return false;
            }
            return true;
          },
        },
      },
      {
        key: 'icon',
        label: $t('modules.system.menu.schema.icon'),
        form: {
          component: 'NInput',
        },
        editForm: {
          ifShow: ({ values }: any) => {
            if (values.type === 'BUTTON') {
              return false;
            }
            return true;
          },
        },
      },
      {
        key: 'order',
        label: $t('modules.system.menu.schema.order'),
        table: {
          render: (row: any) => (
            <NTag type="success" bordered={false} size="small">
              {row.order}
            </NTag>
          ),
        },
        form: {
          defaultValue: 0,
          component: 'NInputNumber',
        },
      },
    ],
    // 表格/表单统一配置
    setting: {},
  }));

  // 表格和表单字段
  const tableFields = [
    'more',
    'type',
    'id',
    'name',
    'code',
    'path',
    'component',
    'order',
    'layout',
    'description',
    'createdTime',
    'updatedTime',
    'operate',
  ];
  const formFields = ['id', 'name', 'status'];
  const editFormFields = [
    'type',
    'pid',
    'name',
    'path',
    'code',
    'layout',
    'redirect',
    'order',
    'component',
    'icon',
    'show',
    'description',
  ];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));
  return { columns, formSchemas, editFormSchemas };
};
