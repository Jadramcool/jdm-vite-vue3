import { $t } from '@/locales/i18n';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { FormItemRule, NButton, NPopconfirm, NSpace, NSwitch, NTag } from 'naive-ui';
import { RowData } from 'naive-ui/es/data-table/src/interface';
import { computed, unref } from 'vue';

// 配置类型选项
const configTypeOptions = [
  { label: '字符串', value: 'STRING' },
  { label: '数字', value: 'NUMBER' },
  { label: '布尔值', value: 'BOOLEAN' },
  { label: 'JSON', value: 'JSON' },
  { label: '数组', value: 'ARRAY' },
];

// 配置分类选项
const categoryOptions = [
  { label: '系统配置', value: 'SYSTEM' },
  { label: '业务配置', value: 'BUSINESS' },
  { label: '界面配置', value: 'UI' },
  { label: '安全配置', value: 'SECURITY' },
  { label: '其他配置', value: 'OTHER' },
];

// 表格和表单配置函数
export const useConfigSchema = (methods: any = {}) => {
  const schema = computed(() => ({
    properties: [
      {
        key: 'id',
        label: $t('common.id'),
        defaultValue: undefined,
        table: {
          width: 80,
        },
      },
      {
        key: 'key',
        label: '配置键名',
        defaultValue: undefined,
        form: {
          component: 'NInput',
          query: 'like',
          componentProps: {
            placeholder: '请输入配置键名',
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
                  return new Error('请输入配置键名');
                }
                if (value.length < 2) {
                  return new Error('配置键名长度不能少于2个字符');
                }
                if (value.length > 50) {
                  return new Error('配置键名长度不能超过50个字符');
                }
                // 验证键名格式（只允许字母、数字、下划线、点号）
                if (!/^[a-zA-Z0-9_.]+$/.test(value)) {
                  return new Error('配置键名只能包含字母、数字、下划线和点号');
                }
                return true;
              },
            },
          ],
          componentProps: {
            maxlength: 50,
            showCount: true,
            placeholder: '请输入配置键名（如：system.title）',
          },
        },
        table: {
          fixed: 'left',
          render: (row: any) => (
            <NTag bordered={false} type="info" size="small">
              {row.key}
            </NTag>
          ),
        },
      },
      {
        key: 'name',
        label: '配置名称',
        defaultValue: undefined,
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: '请输入配置名称',
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
                  return new Error('请输入配置名称');
                }
                if (value.length < 2) {
                  return new Error('配置名称长度不能少于2个字符');
                }
                if (value.length > 50) {
                  return new Error('配置名称长度不能超过50个字符');
                }
                return true;
              },
            },
          ],
          componentProps: {
            maxlength: 50,
            showCount: true,
            placeholder: '请输入配置名称',
          },
        },
      },
      {
        key: 'value',
        label: '配置值',
        defaultValue: undefined,
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: '请输入配置值',
            type: 'text',
          },
        },
        editForm: {
          rules: [
            {
              required: true,
              trigger: ['blur', 'input'],
              validator: (_rule: FormItemRule, value: string) => {
                if (!value) {
                  return new Error('请输入配置值');
                }
                return true;
              },
            },
          ],
          componentProps: {
            type: 'textarea',
            autosize: { minRows: 2, maxRows: 4 },
          },
        },
        table: {
          render: (row: any) => {
            const { value, type } = row;

            if (!value && value !== 0 && value !== false) {
              return '-';
            }

            // 根据配置类型进行不同的渲染处理
            switch (type) {
              case 'BOOLEAN': {
                return (
                  <NTag
                    bordered={false}
                    type={value === 'true' || value === true ? 'success' : 'error'}
                    size="small"
                  >
                    {value === 'true' || value === true ? '是' : '否'}
                  </NTag>
                );
              }
              case 'NUMBER': {
                return <span style="font-family: monospace;">{value}</span>;
              }
              case 'JSON': {
                try {
                  const jsonValue = typeof value === 'string' ? JSON.parse(value) : value;
                  const jsonStr = JSON.stringify(jsonValue, null, 2);
                  return (
                    <span style="font-family: monospace; color: #666;" title={jsonStr}>
                      {jsonStr.length > 50 ? `${jsonStr.substring(0, 50)}...` : jsonStr}
                    </span>
                  );
                } catch {
                  return (
                    <span style="color: #f56c6c;">
                      {String(value).length > 50
                        ? `${String(value).substring(0, 50)}...`
                        : String(value)}
                    </span>
                  );
                }
              }
              case 'ARRAY': {
                try {
                  const arrayValue = typeof value === 'string' ? JSON.parse(value) : value;
                  if (Array.isArray(arrayValue)) {
                    return (
                      <NTag bordered={false} type="info" size="small">
                        数组 ({arrayValue.length}项)
                      </NTag>
                    );
                  }
                  return <span style="color: #f56c6c;">格式错误</span>;
                } catch {
                  return <span style="color: #f56c6c;">格式错误</span>;
                }
              }
              case 'STRING':
              default: {
                const stringValue = String(value);
                return (
                  <span title={stringValue}>
                    {stringValue.length > 50 ? `${stringValue.substring(0, 50)}...` : stringValue}
                  </span>
                );
              }
            }
          },
        },
      },
      {
        key: 'type',
        label: '配置类型',
        defaultValue: undefined,
        form: {
          component: 'NSelect',
          componentProps: {
            placeholder: '请选择配置类型',
            options: unref(configTypeOptions),
            clearable: true,
          },
        },
        editForm: {
          rules: [
            {
              type: 'string',
              required: true,
              trigger: ['blur', 'change'],
              message: '请选择配置类型',
            },
          ],

          componentProps({ formActionType }: Record<string, any>) {
            const { updateSchema, setFieldsValue } = formActionType;
            return {
              placeholder: '请选择配置类型',
              options: unref(configTypeOptions),
              clearable: true,
              /**
               * 监听编辑表单中配置类型选择变化
               * @param value 选中的配置类型值
               */
              onUpdateValue: async (value: string) => {
                console.log('编辑表单配置类型变化:', value);
                await setFieldsValue({
                  value: undefined,
                });
                // 根据配置类型动态更新value字段的组件配置
                if (value === 'JSON') {
                  await updateSchema({
                    field: 'value',
                    component: 'NInput',
                    defaultValue: undefined,
                    componentProps: {
                      type: 'textarea',
                      autosize: { minRows: 3, maxRows: 6 },
                      placeholder: '请输入JSON格式的配置值',
                    },
                  });
                } else if (value === 'BOOLEAN') {
                  await updateSchema({
                    field: 'value',
                    component: 'NRadioGroup',
                    defaultValue: undefined,
                    componentProps: {
                      options: [
                        { label: '是', value: 'true' },
                        { label: '否', value: 'false' },
                      ],
                    },
                  });
                } else if (value === 'NUMBER') {
                  await updateSchema({
                    field: 'value',
                    component: 'NInputNumber',
                    defaultValue: undefined,
                    componentProps: {
                      placeholder: '请输入数字',
                    },
                  });
                } else if (value === 'ARRAY') {
                  await updateSchema({
                    field: 'value',
                    component: 'NInput',
                    defaultValue: undefined,
                    componentProps: {
                      type: 'textarea',
                      autosize: { minRows: 2, maxRows: 4 },
                      placeholder: '请输入数组格式的配置值，如：["item1", "item2"]',
                    },
                  });
                } else {
                  // STRING 类型
                  await updateSchema({
                    field: 'value',
                    component: 'NInput',
                    defaultValue: undefined,
                    componentProps: {
                      placeholder: '请输入配置值',
                    },
                  });
                }
              },
            };
          },
        },
        table: {
          render: (row: any) => {
            const typeOption = unref(configTypeOptions).find((item) => item.value === row.type);
            const colors: Record<string, string> = {
              STRING: 'default',
              NUMBER: 'primary',
              BOOLEAN: 'success',
              JSON: 'warning',
              ARRAY: 'info',
            };
            return (
              <NTag
                bordered={false}
                type={
                  colors[row.type] as
                    | 'default'
                    | 'primary'
                    | 'success'
                    | 'warning'
                    | 'info'
                    | 'error'
                }
                size="small"
              >
                {typeOption?.label || row.type}
              </NTag>
            );
          },
        },
      },
      {
        key: 'category',
        label: '配置分类',
        defaultValue: undefined,
        form: {
          component: 'NSelect',
          componentProps: {
            clearable: true,
            placeholder: '请选择配置分类',
            options: unref(categoryOptions),
          },
        },
        editForm: {
          rules: [
            {
              type: 'string',
              required: true,
              trigger: ['blur', 'change'],
              message: '请选择配置分类',
            },
          ],
          componentProps: {
            options: unref(categoryOptions),
          },
        },
        table: {
          render: (row: any) => {
            const categoryOption = unref(categoryOptions).find(
              (item) => item.value === row.category,
            );
            return (
              <NTag bordered={false} type="warning" size="small">
                {categoryOption?.label || row.category || '系统配置'}
              </NTag>
            );
          },
        },
      },
      {
        key: 'description',
        label: '配置描述',
        defaultValue: undefined,
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: '请输入配置描述',
          },
        },
        editForm: {
          componentProps: {
            placeholder: '请输入配置描述',
            type: 'textarea',
            autosize: { minRows: 2, maxRows: 4 },
          },
        },
        table: {
          ellipsis: {
            tooltip: true,
          },
          render: (row: any) => row.description || '-',
        },
      },
      {
        key: 'isSystem',
        label: '系统配置',
        defaultValue: undefined,
        form: {
          component: 'NSelect',
          componentProps: {
            placeholder: '是否为系统配置',
            options: [
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ],
          },
        },
        editForm: {
          component: 'NSelect',
          componentProps: {
            placeholder: '是否为系统配置',
            options: [
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ],
          },
        },
        table: {
          render: (row: any) => (
            <NSwitch
              value={!!row.isSystem}
              loading={methods.loadingStates?.value?.[row.id]?.system || false}
              onUpdateValue={(value: boolean) => methods.handleToggleSystem(row, value)}
            />
          ),
        },
      },
      {
        key: 'isPublic',
        label: '公开配置',
        defaultValue: undefined,
        form: {
          component: 'NSelect',
          componentProps: {
            placeholder: '是否为公开配置',
            options: [
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ],
          },
        },
        editForm: {
          component: 'NSelect',
          componentProps: {
            placeholder: '是否为公开配置',
            options: [
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ],
          },
        },
        table: {
          render: (row: any) => (
            <NSwitch
              value={!!row.isPublic}
              loading={methods.loadingStates?.value?.[row.id]?.public || false}
              onUpdateValue={(value: boolean) => methods.handleTogglePublic(row, value)}
            />
          ),
        },
      },
      {
        key: 'sortOrder',
        label: '排序',
        defaultValue: 0,
        form: {
          component: 'NInputNumber',
          componentProps: {
            placeholder: '请输入排序值',
            min: 0,
            max: 9999,
          },
        },
        editForm: {
          component: 'NInputNumber',
          componentProps: {
            placeholder: '请输入排序值',
            min: 0,
            max: 9999,
          },
        },
        table: {
          render: (row: any) => row.sortOrder || 0,
        },
      },
      {
        key: 'createdTime',
        label: $t('common.createdTime'),
        defaultValue: undefined,
        form: {
          component: 'NDatePicker',
          componentProps: {
            type: 'daterange',
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
            defaultTime: ['00:00:00', '23:59:59'],
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
          fixed: 'right',
          width: 180,
          render: (row: RowData) => (
            <NSpace justify="center">
              <NButton
                type="primary"
                ghost
                size="small"
                onClick={() => methods.handleEdit(row)}
                disabled={row.isSystem === '1'}
              >
                {$t('common.edit')}
              </NButton>
              <NPopconfirm
                onPositiveClick={() => methods.handleDelete(row)}
                v-slots={{
                  trigger: () => (
                    <NButton type="error" ghost size="small" disabled={row.isSystem === '1'}>
                      {$t('common.delete')}
                    </NButton>
                  ),
                }}
              >
                是否确认删除配置项 {row.key}？
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
    'key',
    'id',
    'name',
    'value',
    'type',
    'category',
    'description',
    'isSystem',
    'isPublic',
    'sortOrder',
    'createdTime',
    'updatedTime',
    'operate',
  ];
  const formFields = [
    'key',
    'name',
    'type',
    'category',
    'description',
    'isSystem',
    'isPublic',
    'createdTime',
    'updatedTime',
  ];
  const editFormFields = [
    'key',
    'name',
    'value',
    'type',
    'category',
    'description',
    'isSystem',
    'isPublic',
    'sortOrder',
  ];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));

  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));
  return { columns, formSchemas, editFormSchemas };
};
