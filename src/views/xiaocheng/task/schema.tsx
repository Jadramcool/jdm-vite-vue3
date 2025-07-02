import { xiaochengLaneColorMap, xiaochengStatusColorMap, xiaochengTypeColorMap } from '@/constants';
import { $t } from '@/locales/i18n';
import { columnsUtil, formSchemaUtil } from '@/utils';
import { NButton, NEllipsis, NSpace, NTag } from 'naive-ui';
import { RowData } from 'naive-ui/es/data-table/src/interface';
import { computed } from 'vue';

// 表格和表单配置函数
export const useTaskSchema = (data: any = {}) => {
  const schema = computed(() => ({
    properties: [
      {
        key: 'id',
        label: $t('common.id'),
        defaultValue: undefined,
        form: {
          component: 'NInputNumber',
          labelMessage: 'ID是用户的唯一标识',
          componentProps: {
            showButton: false,
            min: 1,
            step: 1,
            precision: 0,
          },
        },
      },
      {
        key: 'name',
        label: '名称',
        defaultValue: undefined,
        form: {
          component: 'NInput',
          componentProps: {},
        },
        table: {
          width: 200,
          align: 'left',
          render: (row: RowData) => {
            return (
              <NEllipsis style={{ maxWidth: '400px' }} class={'font-bold'}>
                {row.name}
              </NEllipsis>
            );
          },
        },
      },
      {
        key: 'type_name',
        label: '类型',
        table: {
          render: (row: RowData) => {
            return (
              <NTag bordered={false} type={xiaochengTypeColorMap[row.type]}>
                {row.type_name}
              </NTag>
            );
          },
        },
        form: {
          component: 'NSelect',
          componentProps: {
            options: [
              {
                label: 'BUG',
                value: 'BUG',
              },
              {
                label: '需求',
                value: 'REQ',
              },
              {
                label: '优化',
                value: 'OPT',
              },
            ],
          },
        },
      },
      {
        key: 'lane',
        label: '卡片池',
        table: {
          render: (row: RowData) => {
            return (
              <NTag
                bordered={false}
                color={{
                  color: xiaochengLaneColorMap[data.allLanes[row.lane_id]],
                  textColor: '#444',
                }}
              >
                {data.allLanes[row.lane_id]}
              </NTag>
            );
          },
        },
        form: {
          component: 'NSelect',
          componentProps: {
            options: (() => {
              const allValues = Array.from(
                new Set(Object.values(data.allLanes).map((value) => value)),
              );
              return allValues.map((value) => ({
                label: value,
                value,
              }));
            })(),
          },
        },
      },
      {
        key: 'status',
        label: '状态',
        table: {
          render: (row: RowData) => {
            return (
              <NTag
                bordered={false}
                color={{ color: xiaochengStatusColorMap[row.status], textColor: '#444' }}
              >
                {row.status}
              </NTag>
            );
          },
        },
        form: {
          component: 'NSelect',
          componentProps: {
            options: [
              {
                label: '未开始',
                value: '未开始',
              },
              {
                label: '进行中',
                value: '进行中',
              },
              {
                label: '已完成',
                value: '已完成',
              },
            ],
          },
        },
      },
      {
        key: 'project',
        label: '项目',
        table: {
          render: (row: RowData) => {
            return row.project.name;
          },
        },
      },
      {
        key: 'users',
        label: '参与人',
        table: {
          render: (row: RowData) => {
            return (
              <NSpace>
                {row.users
                  .filter((user: any) => {
                    return user.is_assignor;
                  })
                  .map((user: any) => (
                    <NTag bordered={false}>{user.nickname}</NTag>
                  ))}
              </NSpace>
            );
          },
        },
      },
      {
        key: 'operate',
        label: $t('common.operate'),
        table: {
          fixed: 'right',
          width: 220,
          render: (row: RowData) => (
            <NSpace justify="center">
              <NButton ghost size="small" onClick={() => data.schemaMethods.handleCopy(row)}>
                复制
              </NButton>
              <NButton
                type="primary"
                ghost
                size="small"
                onClick={() => data.schemaMethods.handleReview(row)}
              >
                评审
              </NButton>
            </NSpace>
          ),
        },
      },
    ],
    // 表格/表单统一配置
    setting: {},
  }));

  // 表格和表单字段
  const tableFields = ['id', 'name', 'type_name', 'lane', 'status', 'project', 'users', 'operate'];
  const formFields = ['name', 'type_name', 'lane', 'status'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));

  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  return { columns, formSchemas };
};
