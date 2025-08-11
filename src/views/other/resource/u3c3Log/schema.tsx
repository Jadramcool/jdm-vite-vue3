import { $t } from '@/locales/i18n';
import { columnsUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton, NPopconfirm, NSpace, NTag, NTooltip } from 'naive-ui';
import { computed } from 'vue';

/**
 * 日志状态颜色映射
 */
const statusColorMap: Record<string, string> = {
  success: 'success',
  running: 'info',
  failed: 'error',
  pending: 'warning',
};

/**
 * 日志状态选项
 */
const statusOptions = [
  { label: '完成', value: 'completed' },
  { label: '运行中', value: 'running' },
  { label: '失败', value: 'failed' },
];

/**
 * 格式化持续时间
 * @param durationMs 持续时间（毫秒）
 * @returns 格式化后的持续时间字符串
 */
const formatDuration = (durationMs: number): string => {
  if (!durationMs) return '-';

  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

export const useLogSchema = (methods: any = {}) => {
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
            placeholder: '请输入日志ID',
          },
        },
        table: {
          width: 80,
          fixed: 'left',
        },
      },
      {
        key: 'start_time',
        label: '开始时间',
        defaultValue: undefined,
        form: {
          component: 'NDatePicker',
          componentProps: {
            type: 'datetimerange',
            clearable: true,
            placeholder: '请选择开始时间范围',
          },
        },
        table: {
          width: 160,
          render: (row: any) => {
            return row.start_time ? dayjs(row.start_time).format('YYYY-MM-DD HH:mm:ss') : '-';
          },
        },
      },
      {
        key: 'end_time',
        label: '结束时间',
        defaultValue: undefined,
        form: {
          component: 'NDatePicker',
          componentProps: {
            type: 'datetimerange',
            clearable: true,
            placeholder: '请选择结束时间范围',
          },
        },
        table: {
          width: 160,
          render: (row: any) => {
            return row.end_time ? dayjs(row.end_time).format('YYYY-MM-DD HH:mm:ss') : '-';
          },
        },
      },
      {
        key: 'duration_ms',
        label: '持续时间',
        defaultValue: undefined,
        table: {
          width: 120,
          render: (row: any) => {
            return formatDuration(row.duration_ms);
          },
        },
      },
      {
        key: 'total_pages',
        label: '总页数',
        defaultValue: undefined,
        form: {
          component: 'NInputNumber',
          componentProps: {
            showButton: false,
            min: 0,
            placeholder: '请输入总页数',
          },
        },
        table: {
          width: 100,
          render: (row: any) => {
            return row.total_pages || 0;
          },
        },
      },
      {
        key: 'total_items',
        label: '总条目数',
        defaultValue: undefined,
        form: {
          component: 'NInputNumber',
          componentProps: {
            showButton: false,
            min: 0,
            placeholder: '请输入总条目数',
          },
        },
        table: {
          width: 100,
          render: (row: any) => {
            return row.total_items || 0;
          },
        },
      },
      {
        key: 'new_items',
        label: '新增条目',
        defaultValue: undefined,
        form: {
          component: 'NInputNumber',
          componentProps: {
            showButton: false,
            min: 0,
            placeholder: '请输入新增条目数',
          },
        },
        table: {
          width: 100,
          render: (row: any) => {
            return (
              <NTag type="success" size="small">
                {row.new_items || 0}
              </NTag>
            );
          },
        },
      },
      {
        key: 'duplicate_items',
        label: '重复条目',
        defaultValue: undefined,
        form: {
          component: 'NInputNumber',
          componentProps: {
            showButton: false,
            min: 0,
            placeholder: '请输入重复条目数',
          },
        },
        table: {
          width: 100,
          render: (row: any) => {
            return (
              <NTag type="warning" size="small">
                {row.duplicate_items || 0}
              </NTag>
            );
          },
        },
      },
      {
        key: 'status',
        label: '状态',
        defaultValue: undefined,
        form: {
          component: 'NSelect',
          componentProps: {
            options: statusOptions,
            clearable: true,
            placeholder: '请选择状态',
          },
        },
        table: {
          width: 100,
          render: (row: any) => {
            const status = row.status || 'pending';
            return (
              <NTag type={statusColorMap[status] as any} bordered={false} size="small">
                {statusOptions.find((option) => option.value === status)?.label || status}
              </NTag>
            );
          },
        },
      },
      {
        key: 'error_message',
        label: '错误信息',
        defaultValue: undefined,
        form: {
          component: 'NInput',
          componentProps: {
            placeholder: '请输入错误信息关键词',
          },
        },
        table: {
          width: 200,
          render: (row: any) => {
            if (!row.error_message) return '-';

            const errorMsg = row.error_message;
            const shortMsg = errorMsg.length > 50 ? `${errorMsg.substring(0, 50)}...` : errorMsg;

            return (
              <NTooltip trigger="hover">
                {{
                  trigger: () => (
                    <span style={{ color: '#d03050', cursor: 'pointer' }}>{shortMsg}</span>
                  ),
                  default: () => errorMsg,
                }}
              </NTooltip>
            );
          },
        },
      },
      {
        key: 'created_at',
        label: '创建时间',
        defaultValue: undefined,
        form: {
          component: 'NDatePicker',
          componentProps: {
            type: 'datetimerange',
            clearable: true,
            placeholder: '请选择创建时间范围',
          },
        },
        table: {
          width: 160,
          render: (row: any) => {
            return row.created_at ? dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss') : '-';
          },
        },
      },
      {
        key: 'operate',
        label: $t('common.operate'),
        table: {
          width: 200,
          fixed: 'right',
          render: (row: any) => (
            <NSpace justify="center">
              <NButton type="info" ghost size="small" onClick={() => methods.handleViewDetail(row)}>
                查看详情
              </NButton>
              {row.status === 'failed' && (
                <NButton type="warning" ghost size="small" onClick={() => methods.handleRetry(row)}>
                  重新执行
                </NButton>
              )}
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
    'start_time',
    'end_time',
    'duration_ms',
    'total_pages',
    'total_items',
    'new_items',
    'duplicate_items',
    'status',
    'error_message',
    'created_at',
    'operate',
  ];

  const formFields = ['id', 'start_time', 'end_time', 'status', 'created_at'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  return { columns, formSchemas };
};
