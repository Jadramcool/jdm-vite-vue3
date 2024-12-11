import { MenuApi } from '@/api';
import { JayIcon } from '@/components';
import { layoutOptions, MenuTypeColorMap, MenuTypeOptions } from '@/constants';
import { $t } from '@/locales/i18n';
import { arrayToTree, columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { toLower } from 'lodash';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { computed } from 'vue';

// 页面布局

const locales = (field: string) => $t(`modules.system.menu.${field}`);

export const useMenuSchema = (methods: any = {}) => {
  const schema = computed(() => ({
    properties: [
      {
        key: 'id',
        label: $t('common.id'),
        defaultValue: undefined,
        table: {
          width: 60,
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
            placeholder: $t('modules.system.menu.schema.pleaseInputName'),
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: $t('modules.system.menu.schema.pleaseInputName'),
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
            placeholder: $t('modules.system.menu.schema.pleaseInputCode'),
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: $t('modules.system.menu.schema.pleaseInputCode'),
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
            placeholder: $t('modules.system.menu.schema.pleaseInputDescription'),
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
          render: (row: any) => {
            const path = row.path || '-';
            return (
              <div onClick={() => methods.copy(path)} class="cursor-pointer">
                {path}
              </div>
            );
          },
        },
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: $t('modules.system.menu.schema.pleaseInputPath'),
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              message: $t('modules.system.menu.schema.pleaseInputPath'),
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
          width: 100,
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
            placeholder: $t('common.pleaseSelect'),
            afterRequest: (data: any) => {
              return arrayToTree(data);
            },
          },
        },
        editForm: {
          labelMessage: $t('message.notSelectDefaultTop'),
        },
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
              message: `${$t('common.pleaseSelect')}`,
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
          component: 'NSwitch',
          defaultValue: true,
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
        key: 'component',
        label: $t('modules.system.menu.schema.component'),
        table: {
          ellipsis: {
            tooltip: true,
          },
          render: (row: NaiveUI.RowData) => row.component || '-',
        },
        form: {
          component: 'NInput',
        },
        editForm: {
          rules: [
            {
              required: false,
              message: $t('modules.system.menu.schema.pleaseInputComponent'),
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
        table: {
          render: (row: any) => {
            return <JayIcon icon={row.icon} size={20} />;
          },
        },
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
          width: 100,
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
      {
        key: 'keepAlive',
        label: $t('modules.system.menu.schema.keepAlive'),
        form: {
          defaultValue: false,
          component: 'NSwitch',
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
      // -------------extraData-----------------
      {
        key: 'withContentCard',
        label: $t('modules.system.menu.schema.withContentCard'),
        form: {
          defaultValue: true,
          component: 'NSwitch',
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
    'icon',
    'order',
    'layout',
    'description',
    'createdTime',
    'updatedTime',
    'operate',
  ];
  const formFields = ['id', 'name'];
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
    'keepAlive',
    'description',
  ];
  const extraEditFormFields = ['withContentCard'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));

  const extraDataFromSchemas = computed(() =>
    editFormSchemaUtil(schema.value, extraEditFormFields),
  );

  return { columns, formSchemas, editFormSchemas, extraDataFromSchemas };
};
