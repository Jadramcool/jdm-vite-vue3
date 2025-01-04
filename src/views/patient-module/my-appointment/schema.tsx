import { DepartmentApi, DoctorApi } from '@/api';
import {
  AppointmentStatusOptions,
  AppointmentStatusTypeOptions,
  timePeriodOptions,
} from '@/constants';
import { $t } from '@/locales/i18n';
import { columnsUtil, editFormSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { RowData } from 'naive-ui/es/data-table/src/interface';
import { computed } from 'vue';

export const useAppointmentSchema = (methods: any = {}) => {
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
        key: 'doctorSchedule.doctor.id',
        label: '医生',
        defaultValue: undefined,
        table: {
          // render: (row: any) => row.doctorSchedule.doctor?.user?.name || '-',
          render: (row: RowData) => {
            return (
              <NButton text type="primary" onClick={() => methods.handleDetail(row)}>
                {row.doctorSchedule.doctor?.user?.name}
              </NButton>
            );
          },
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
            filterable: true,
            placeholder: '请选择医生',
            labelField: 'user.name',
            valueField: 'id',
          },
        },
      },
      {
        key: 'doctorSchedule.doctor.department.id',
        label: '所属科室',
        defaultValue: undefined,
        form: {
          component: 'ApiSelect',
          componentProps: {
            api: DepartmentApi.departmentList,
            placeholder: `请选择科室`,
            labelField: 'name',
            valueField: 'id',
            onUpdateValue: (value: any) => {
              console.log(value);
            },
          },
        },
        table: {
          render: (row: any) => row.doctorSchedule.doctor?.department?.name || '-',
        },
      },
      {
        key: 'doctorSchedule.date',
        label: '就诊日期',
        defaultValue: undefined,
        table: {
          render: (row: any) => {
            const { date, timePeriod } = row.doctorSchedule;
            const newDate = dayjs(date).format('YYYY-MM-DD');
            const newTimePeriod = unref(timePeriodOptions).find(
              (item: any) => item.value === timePeriod,
            )?.label;
            return `${newDate} - ${newTimePeriod}  `;
          },
        },
        form: {
          component: 'NDatePicker',
          componentProps: {
            type: 'date',
            placeholder: $t('common.pleaseSelect'),
          },
        },
      },
      {
        key: 'status',
        label: '就诊状态',
        defaultValue: undefined,
        table: {
          render: (row: any) => {
            const statusString = AppointmentStatusOptions.find(
              (item) => item.value === row.status,
            )?.label;
            const color = AppointmentStatusTypeOptions[row.status];
            return (
              <NTag bordered={false} type={color} size="small">
                {statusString}
              </NTag>
            );
          },
        },
        form: {
          component: 'NSelect',
          componentProps: {
            options: unref(AppointmentStatusOptions),
          },
        },
      },
      {
        key: 'appointmentDate',
        label: '挂号时间',
        defaultValue: undefined,
        table: {
          render: (row: any) => dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss'),
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
          render: (row: any) => (
            <NSpace justify="center">
              {row.status === 'UNFINISHED' && (
                <NPopconfirm
                  onPositiveClick={() => methods.handleCancel(row)}
                  v-slots={{
                    trigger: () => (
                      <NButton type="error" ghost size="small">
                        取消挂号
                      </NButton>
                    ),
                  }}
                >
                  是否确认取消挂号？
                </NPopconfirm>
              )}
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
    'doctorSchedule.doctor.id',
    'doctorSchedule.doctor.department.id',
    'doctorSchedule.date',
    'status',
    'appointmentDate',
    'operate',
  ];
  const formFields = [
    'doctorSchedule.doctor.id',
    'doctorSchedule.doctor.department.id',
    'doctorSchedule.date',
    'status',
  ];
  const editFormFields = ['departmentId', 'doctorId', 'date'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  const editFormSchemas = computed(() => editFormSchemaUtil(schema.value, editFormFields));

  return { columns, formSchemas, editFormSchemas };
};
