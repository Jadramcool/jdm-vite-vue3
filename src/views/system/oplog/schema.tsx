import JayIcon from '@/components/common/JayIcon.vue';
import { $t } from '@/locales/i18n';
import { columnsUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton, NPopconfirm, NSpace, NTag, NTooltip } from 'naive-ui';
import { RowData } from 'naive-ui/es/data-table/src/interface';
import { computed, unref } from 'vue';
import {
  operationStatusColorOptions,
  operationStatusOptions,
  operationTypeOptions,
} from './constants';

// 表格和表单配置函数
export const useOpLogSchema = (methods: any = {}) => {
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
        key: 'username',
        label: $t('common.username'),
        defaultValue: undefined,
      },
      {
        key: 'userId',
        label: '用户ID',
        defaultValue: undefined,
      },
      {
        key: 'operationType',
        label: '操作类型',
        defaultValue: undefined,
        form: {
          component: 'NSelect',
          componentProps: {
            options: unref(operationTypeOptions),
          },
        },
        table: {
          width: 120,
          render: (row: any) => {
            const option = unref(operationTypeOptions).find(
              (item: any) => item.value === row.operationType,
            );

            // 操作类型颜色映射
            const getOperationColor = (type: string) => {
              const colorMap: Record<string, string> = {
                CREATE: '#52c41a',
                UPDATE: '#1890ff',
                DELETE: '#ff4d4f',
                VIEW: '#722ed1',
                LOGIN: '#13c2c2',
                LOGOUT: '#fa8c16',
                EXPORT: '#eb2f96',
                IMPORT: '#f759ab',
                OTHER: '#8c8c8c',
              };
              return colorMap[type] || colorMap.OTHER;
            };

            if (!option) return '-';

            return (
              <NTag
                type="info"
                size="small"
                style={{
                  backgroundColor: `${getOperationColor(row.operationType)}15`,
                  borderColor: getOperationColor(row.operationType),
                  color: getOperationColor(row.operationType),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {option.label}
                </div>
              </NTag>
            );
          },
        },
      },
      {
        key: 'method',
        label: '请求方法',
        defaultValue: undefined,
        table: {
          width: 100,
          render: (row: any) => {
            const { method } = row;
            if (!method) return '-';

            // HTTP方法颜色映射
            const getMethodColor = (method: string) => {
              const colorMap: Record<string, string> = {
                GET: 'success',
                POST: 'info',
                PUT: 'warning',
                DELETE: 'error',
                PATCH: 'default',
              };
              return colorMap[method.toUpperCase()] || 'default';
            };

            return (
              <NTag
                type={
                  getMethodColor(method) as 'success' | 'info' | 'warning' | 'error' | 'default'
                }
                size="small"
                strong
              >
                {method.toUpperCase()}
              </NTag>
            );
          },
        },
      },
      {
        key: 'module',
        label: '模块',
        defaultValue: undefined,
      },
      {
        key: 'description',
        label: '操作描述',
        defaultValue: undefined,
      },
      {
        key: 'url',
        label: '请求URL',
        defaultValue: undefined,
        table: {
          width: 200,
          render: (row: any) => {
            const { url } = row;
            if (!url) return '-';

            const baseUrl = url.split('?')[0];

            return (
              <NTooltip trigger="hover">
                {{
                  trigger: () => (
                    <span
                      style={{
                        color: '#1890ff',
                        cursor: 'pointer',
                        fontFamily: 'Monaco, Consolas, monospace',
                        fontSize: '12px',
                      }}
                    >
                      {baseUrl}
                    </span>
                  ),
                  default: () => url,
                }}
              </NTooltip>
            );
          },
        },
      },
      {
        key: 'ipAddress',
        label: 'IP地址',
        defaultValue: undefined,
        table: {
          width: 140,
          render: (row: any) => {
            const { ipAddress } = row;
            if (!ipAddress) return '-';

            // 判断是否为内网IP
            const isPrivateIP = (ip: string) => {
              const privateRanges = [
                /^10\./,
                /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
                /^192\.168\./,
                /^127\./,
                /^localhost$/i,
              ];
              return privateRanges.some((range) => range.test(ip));
            };

            const isPrivate = isPrivateIP(ipAddress);

            return (
              <NTag
                type={isPrivate ? 'info' : 'default'}
                size="small"
                style={{
                  fontFamily: 'Monaco, Consolas, monospace',
                  fontSize: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <JayIcon icon={'material-symbols:location-on-outline'} size={14} />
                  <span title={isPrivate ? '内网IP' : '公网IP'}>{ipAddress}</span>
                </div>
              </NTag>
            );
          },
        },
      },
      {
        key: 'duration',
        label: '执行时长(ms)',
        defaultValue: undefined,
        table: {
          width: 120,
          render: (row: any) => {
            const { duration } = row;
            if (duration === undefined || duration === null) return '-';

            // 根据执行时长设置颜色
            const getDurationColor = (duration: number) => {
              if (duration < 100) return 'success'; // 快速
              if (duration < 500) return 'info'; // 正常
              if (duration < 1000) return 'warning'; // 较慢
              return 'error'; // 慢
            };

            // 格式化时长显示
            const formatDuration = (duration: number) => {
              if (duration < 1000) {
                // 我不知道为什么，如果采用`${duration}ms`会发挥 112ms="
                return `${duration}${'ms'}`;
              }
              return `${(duration / 1000).toFixed(2)}s`;
            };

            return (
              <NTag type={getDurationColor(duration)} size="small">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <JayIcon icon={'material-symbols:nest-clock-farsight-analog-outline'} size={14} />
                  <span>{formatDuration(duration)}</span>
                </div>
              </NTag>
            );
          },
        },
      },
      {
        key: 'params',
        label: '请求参数',
        defaultValue: undefined,
        table: {
          width: 150,
          render: (row: any) => {
            const { params } = row;
            if (!params || params === '{}') return '-';
            return (
              <NButton
                text
                type="primary"
                size="small"
                onClick={() => {
                  methods.showParamsModal(params);
                }}
              >
                查看参数
              </NButton>
            );
          },
        },
      },
      {
        key: 'result',
        label: '响应结果',
        defaultValue: undefined,
        table: {
          render: (row: any) => {
            const { result } = row;
            if (!result) return '-';
            return (
              <NButton
                text
                type="primary"
                size="small"
                onClick={() => {
                  methods.showResultModal(result);
                }}
              >
                查看结果
              </NButton>
            );
          },
        },
      },
      {
        key: 'errorMessage',
        label: '错误信息',
        defaultValue: undefined,
        table: {
          width: 120,
          render: (row: any) => {
            const { errorMessage } = row;
            if (!errorMessage) return '-';
            return (
              <NButton
                text
                type="error"
                size="small"
                onClick={() => {
                  methods.showErrorModal(errorMessage);
                }}
              >
                查看错误
              </NButton>
            );
          },
        },
      },
      {
        key: 'userAgent',
        label: '用户代理',
        defaultValue: undefined,
        table: {
          width: 120,
          render: (row: any) => {
            const { userAgent } = row;
            if (!userAgent) return '-';

            // 浏览器检测和图标映射
            const getBrowserInfo = (userAgent: string) => {
              if (userAgent.includes('Chrome')) {
                return {
                  name: 'Chrome',
                  icon: 'logos:chrome',
                };
              }
              if (userAgent.includes('Firefox')) {
                return {
                  name: 'Firefox',
                  icon: 'logos:firefox',
                };
              }
              if (userAgent.includes('Safari')) {
                return {
                  name: 'Safari',
                  icon: 'logos:safari',
                };
              }
              if (userAgent.includes('Edge')) {
                return {
                  name: 'Edge',
                  icon: 'logos:microsoft-edge',
                };
              }
              return {
                name: '其他',
                icon: 'logos:internetexplorer',
              };
            };

            const browserInfo = getBrowserInfo(userAgent);

            return (
              <NTooltip trigger="hover">
                {{
                  trigger: () => (
                    <NTag size="small">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <JayIcon icon={browserInfo.icon} size={14} />
                        {browserInfo.name}
                      </div>
                    </NTag>
                  ),
                  default: () => userAgent,
                }}
              </NTooltip>
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
            options: [
              { label: '成功', value: 'SUCCESS' },
              { label: '失败', value: 'FAILED' },
            ],
          },
        },
        table: {
          render: (row: any) => {
            const option = unref(operationStatusOptions).find(
              (item: any) => item.value === row.status,
            );
            return (
              <NTag type={operationStatusColorOptions[row.status]}>{option?.label || '-'}</NTag>
            );
          },
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
          width: 180,
          align: 'center',
          render: (row: any) => {
            const { createdTime } = row;
            if (!createdTime) return '-';

            const now = dayjs();
            const date = dayjs(createdTime);
            const diffDays = now.diff(date, 'day');
            const isOver3Days = diffDays > 3;

            // 计算相对时间或详细时间
            const getDisplayTime = () => {
              if (diffDays > 3) {
                // 超过3天显示详细时间
                return date.format('YYYY-MM-DD HH:mm:ss');
              }
              // 3天内显示相对时间
              const diffHours = now.diff(date, 'hour');
              const diffMinutes = now.diff(date, 'minute');
              const diffSeconds = now.diff(date, 'second');

              if (diffSeconds < 60) return '刚刚';
              if (diffMinutes < 60) return `${diffMinutes}分钟前`;
              if (diffHours < 24) return `${diffHours}小时前`;
              return `${diffDays}天前`;
            };

            const displayTime = getDisplayTime();
            const fullTime = date.format('YYYY-MM-DD HH:mm:ss');

            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#666',
                  fontSize: '13px',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: '500' }}>{displayTime}</div>
                  {!isOver3Days && (
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '1px' }}>
                      {fullTime}
                    </div>
                  )}
                </div>
              </div>
            );
          },
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
          width: 120,
          render: (row: RowData) => (
            <NSpace justify="center">
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
                是否确认删除操作日志 {row.id}？
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
    'username',
    'userId',
    'operationType',
    'method',
    'module',
    // 'description',
    'url',
    'ipAddress',
    'duration',
    'status',
    'params',
    'result',
    'errorMessage',
    'userAgent',
    'createdTime',
    // 'updatedTime',
    // 'operate',
  ];

  const formFields = ['operationType', 'createdTime'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));

  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  return { columns, formSchemas };
};
