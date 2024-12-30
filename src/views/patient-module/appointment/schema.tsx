import { DoctorApi, DoctorScheduleApi } from '@/api';
import { $t } from '@/locales/i18n';
import { useCommonStore } from '@/store';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { computed } from 'vue';

const commonStore = useCommonStore();

export const useScheduleSchema = (methods: any = {}) => {
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
        editForm: {
          componentProps: {
            showButton: false,
            disabled: true,
          },
        },
        table: {
          width: 60,
        },
      },

      {
        key: 'doctorId',
        label: '医生',
        defaultValue: undefined,
        table: {
          render: (row: any) => row.doctor?.user?.name || '-',
        },
        form: {
          component: 'ApiSelect',
          componentProps: {
            api: DoctorApi.list,
            params: {
              options: {
                showPagination: false,
              },
            },
            multiple: false,
            placeholder: '请选择医生',
            labelField: 'user.name',
            valueField: 'id',
          },
        },
      },
      {
        key: 'departmentId',
        label: '所属科室',
        defaultValue: undefined,
        table: {
          render: (row: any) => row.doctor?.department?.name || '-',
        },
      },
      {
        key: 'date',
        label: '排班日期',
        defaultValue: undefined,
        table: {
          render: (row: any) => dayjs(row.date).format('YYYY-MM-DD'),
        },
        form: {
          component: 'NDatePicker',
          componentProps: {
            type: 'date',
            placeholder: $t('common.pleaseSelect'),
          },
        },
        editForm: {
          component: 'MutiDatePicker',
          componentProps: ({ formModel }: any) => {
            return {
              params: {
                filters: {
                  doctorId: formModel.doctorId,
                },
                options: {
                  showPagination: false,
                },
                sort: {
                  date: 'asc',
                },
              },
              api: DoctorScheduleApi.list,
              requiredParams: 'filters.doctorId',
            };
          },
        },
      },
      {
        key: 'appointCount',
        label: '已挂号数',
        defaultValue: undefined,
        table: {
          render: (row: any) => <NTag type="success">{row.appointCount}</NTag>,
        },
      },
      {
        key: 'maxCount',
        label: '最大挂号数',
        defaultValue: undefined,
        table: {
          render: (row: any) => <NTag type="info">{row.maxCount}</NTag>,
        },
      },
      {
        key: 'createdTime',
        label: $t('common.createdTime'),
        defaultValue: undefined,
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
          width: 180,
          fixed: 'right',
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
                是否确认删除该排班？
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
  const tableFields = ['id', 'doctorId', 'date', 'appointCount', 'maxCount', 'operate'];
  const formFields = ['date'];
  const editFormFields = ['departmentId', 'doctorId', 'date'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));

  return { columns, formSchemas, editFormSchemas };
};

export const useEditScheduleSchema = () => {
  const schema = computed(() => ({
    properties: [
      {
        key: 'doctorId',
        label: '医生',
        defaultValue: undefined,
        table: {
          render: (row: any) => row.doctor?.user?.name || '-',
        },
        form: {
          component: 'ApiSelect',
          componentProps: {
            api: DoctorApi.list,
            params: {
              options: JSON.stringify({
                showPagination: false,
              }),
            },
            multiple: true,
            placeholder: '请选择医生',
            labelField: 'user.name',
            valueField: 'id',
          },
        },
      },
      {
        key: 'departmentId',
        label: '所属科室',
        defaultValue: undefined,
        editForm: {
          component: 'NRadioGroup',
          defaultValue: 1,
          componentProps: {
            placeholder: $t('common.pleaseSelect'),
            options: unref(commonStore.getDepartmentOptions),
          },
        },
      },
    ],
  }));
  const editFormFields = ['doctorId'];
  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));
  return { editFormSchemas };
};
