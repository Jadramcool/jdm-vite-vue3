import { DoctorApi, DoctorScheduleApi } from '@/api';
import { $t } from '@/locales/i18n';
import { useCommonStore } from '@/store';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton, NPopconfirm, NSpace } from 'naive-ui';
import { computed } from 'vue';

const commonStore = useCommonStore();

export const useDoctorScheduleSchema = (methods: any = {}) => {
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
        editForm: {
          component: 'ApiSelect',
          componentProps: ({ formModel }: any) => {
            return {
              api: DoctorApi.list,
              params: {
                filters: {
                  departmentId: formModel.departmentId,
                },
                options: {
                  showPagination: false,
                },
              },
              immediate: false,
              multiple: false,
              placeholder: '请选择医生',
              labelField: 'user.name',
              valueField: 'id',
            };
          },
        },
      },
      {
        key: 'departmentId',
        label: '所属科室',
        defaultValue: undefined,
        editForm: {
          component: 'NRadioGroup',
          componentProps: ({ formActionType }: any) => {
            return {
              placeholder: $t('common.pleaseSelect'),
              options: unref(commonStore.getDepartmentOptions),
              onUpdateValue: () => {
                formActionType.setFieldsValue({ doctorId: null });
              },
            };
          },
        },
        table: {
          render: (row: any) => row.doctor?.department?.name || '-',
        },
      },
      // {
      //   key: 'dateType',
      //   label: '排班类型',
      //   defaultValue: undefined,
      //   editForm: {
      //     component: 'NRadioGroup',
      //     defaultValue: 'fixed',
      //     componentProps: {
      //       options: [
      //         {
      //           label: '固定排班',
      //           value: 'fixed',
      //         },
      //         {
      //           label: '周排班',
      //           value: 'week',
      //         },
      //       ],
      //     },
      //   },
      // },
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
      // {
      //   key: 'weekday',
      //   label: '星期排班',
      //   defaultValue: undefined,
      //   editForm: {
      //     component: 'NCheckboxGroup',
      //     componentProps: {
      //       options: [
      //         {
      //           label: '星期一',
      //           value: 'MONDAY',
      //         },
      //         {
      //           label: '星期二',
      //           value: 'TUESDAY',
      //         },
      //         {
      //           label: '星期三',
      //           value: 'WEDNESDAY',
      //         },
      //         {
      //           label: '星期四',
      //           value: 'THURSDAY',
      //         },
      //         {
      //           label: '星期五',
      //           value: 'FRIDAY',
      //         },
      //         {
      //           label: '星期六',
      //           value: 'SATURDAY',
      //         },
      //         {
      //           label: '星期日',
      //           value: 'SUNDAY',
      //         },
      //       ],
      //     },
      //     ifShow: ({ values }: any) => {
      //       if (values.dateType === 'fixed') {
      //         return false;
      //       }
      //       return true;
      //     },
      //   },
      // },
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
  const tableFields = ['id', 'doctorId', 'date', 'departmentId', 'operate'];
  const formFields = ['id', 'doctorId', 'date'];
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
