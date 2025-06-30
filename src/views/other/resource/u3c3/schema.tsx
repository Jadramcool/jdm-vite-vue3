import JayIcon from '@/components/common/JayIcon.vue';
import { resourceU3C3TypeOptions, resourceU3C3TypeColorType } from '@/constants';
import { $t } from '@/locales/i18n';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil, encodeBase64 } from '@/utils';
import dayjs from 'dayjs';
import { toLower } from 'lodash';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { computed, unref, ref } from 'vue';

const locales = (field: string) => $t(`modules.resource.u3c3.${field}`);

export const useResourceSchema = (
  methods: any = {},
  rowEncryptionState: any = ref({}),
  globalEncryptionState: any = ref(true),
) => {
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
          // query: 'in',
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
        table: {
          render: (row: any) => {
            const isEncrypted = unref(rowEncryptionState)[row.id] ?? unref(globalEncryptionState); // 使用全局状态作为默认值
            if (isEncrypted) {
              // 显示加密内容
              const encrypted = encodeBase64(row.title);
              return encrypted.data || row.title;
            }
            // 显示明文内容
            return row.title;
          },
          width: 300,
          ellipsis: {
            tooltip: true,
          },
        },
      },
      {
        key: 'size',
        label: $t('common.size'),
        defaultValue: undefined,
        table: {
          render: (row: any) => {
            // row.size如果是超过1024GB转换成TB;
            // row.size的格式是例如 2048GB，100GB，100MB、100KB
            if (row.size.indexOf('GB') !== -1) {
              if (Number(row.size.replace('GB', '')) > 1024) {
                return `${(row.size.replace('GB', '') / 1024).toFixed(2)} TB`;
              }
            }
            return row.size;
          },
        },
      },
      {
        key: 'date',
        label: $t('common.date'),
        defaultValue: undefined,
        table: {
          render: (row: any) => dayjs(row.date).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
      {
        key: 'link',
        label: $t('common.link'),
        defaultValue: undefined,
        table: {
          render: (row: any) => {
            return (
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  window.location.href = row.magnet_href;
                }}
              >
                <JayIcon type="primary" icon="nimbus:external-link" />
              </div>
            );
          },
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
              <NButton
                type={
                  unref(rowEncryptionState)[row.id] ?? unref(globalEncryptionState)
                    ? 'warning'
                    : 'primary'
                }
                ghost
                size="small"
                onClick={() => methods.toggleRowEncryption(row)}
              >
                {unref(rowEncryptionState)[row.id] ?? unref(globalEncryptionState)
                  ? $t('modules.resource.u3c3.schema.showDecrypted') || '显示明文'
                  : $t('modules.resource.u3c3.schema.showEncrypted') || '显示加密'}
              </NButton>
              {/* <NButton type="primary" ghost size="small" onClick={() => methods.handleEdit(row)}>
                {$t('common.edit')}
              </NButton> */}
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
      {
        key: 'sortBy',
        label: $t('common.sort'),
        defaultValue: undefined,
        form: {
          component: 'NSelect',
          componentProps: {
            options: [
              {
                label: '大小',
                value: 'size_format',
              },
            ],
          },
        },
      },
    ],
    // 表格/表单统一配置
    setting: {},
  }));

  // 表格和表单字段
  const tableFields = ['id', 'type', 'title', 'size', 'date', 'link', 'operate'];
  const formFields = ['type', 'title', 'sortBy'];
  const editFormFields = ['id', 'title', 'type'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));

  return { columns, formSchemas, editFormSchemas };
};
