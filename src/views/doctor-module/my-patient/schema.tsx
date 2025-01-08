import { DepartmentApi, PatientApi } from '@/api';
import {
  AppointmentStatusOptions,
  AppointmentStatusTypeOptions,
  sexOptions,
  timePeriodOptions,
} from '@/constants';
import { $t } from '@/locales/i18n';
import { columnsUtil, descriptionSchemaUtil, formSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton, NSpace, NTag } from 'naive-ui';
import { RowData } from 'naive-ui/es/data-table/src/interface';
import { computed } from 'vue';

export const useMyPatientSchema = (methods: any = {}) => {
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
      },

      {
        key: 'patient.id',
        label: '患者',
        defaultValue: undefined,
        table: {
          // render: (row: any) => row.doctorSchedule.doctor?.user?.name || '-',
          render: (row: RowData) => {
            return (
              <NButton text type="primary" onClick={() => methods.handlePatientDetail(row)}>
                {row.patient?.user?.name}
              </NButton>
            );
          },
        },
        form: {
          component: 'ApiSelect',
          componentProps: {
            api: PatientApi.list,
            params: {
              options: {
                showPagination: false,
              },
            },
            multiple: false,
            filterable: true,
            placeholder: '请选择患者',
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
              {row.status === 'FINISHED' && (
                <NButton
                  type="primary"
                  ghost
                  size="small"
                  onClick={() => methods.handleRecord(row)}
                >
                  查看
                </NButton>
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
    'patient.id',
    'doctorSchedule.date',
    'status',
    'appointmentDate',
    'operate',
  ];
  const formFields = ['patient.id', 'doctorSchedule.date', 'status'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 表单字段配置
  const formSchemas = computed(() => formSchemaUtil(schema.value, formFields));

  return { columns, formSchemas };
};

export const usePatientRecordSchema = () => {
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
        key: 'user.name',
        label: '患者姓名',
        description: {
          render: (row: RowData) => row.user.name || '-',
        },
      },
      {
        key: 'user.sex',
        label: '性别',
        description: {
          render: (row: RowData) =>
            unref(sexOptions).find((item) => item.value === row.user.sex)?.label,
        },
      },
      {
        key: 'user.phone',
        label: '手机号',
        description: {
          render: (row: RowData) => row.user.phone || '-',
        },
      },
      {
        key: 'user.addressDetail',
        label: '详细地址',
        description: {
          render: (row: RowData) => row.user.addressDetail || '-',
          span: 2,
        },
      },
      {
        key: 'user.email',
        label: '电子邮箱',
        description: {
          render: (row: RowData) => row.user.email || '-',
        },
      },
      {
        key: 'user.birthday',
        label: '年龄',
        description: {
          render: (row: RowData) => {
            const birth = dayjs(row.user.birthday);
            const today = dayjs();
            const age = today.diff(birth, 'year');
            return age ? `${age}岁` : '-';
          },
        },
      },

      {
        key: 'mainComplaint',
        label: '主诉',
        description: {
          render: (row: any) => {
            return row?.mainComplaint || '-';
          },
          span: 2,
        },
      },
      {
        key: 'nowSickness',
        label: '现病史',
        description: {
          render: (row: any) => {
            return row?.nowSickness || '-';
          },
          span: 2,
        },
      },
      {
        key: 'diagnostic',
        label: '诊断结果',
        description: {
          render: (row: any) => {
            return row?.diagnostic || '-';
          },
          span: 2,
        },
      },
      {
        key: 'notes',
        label: '详情',
        description: {
          render: (row: any) => {
            const notes = row?.notes || '-';
            return <div class="min-h-180px" innerHTML={notes}></div>;
          },
          span: 2,
        },
      },
      {
        key: 'doctor.user.name',
        label: '主治医生',
        description: {
          render: (row: any) => <div>{row?.doctor?.user?.name || '-'}</div>,
        },
      },
      {
        key: 'createdTime',
        label: '就诊时间',
        description: {
          render: (row: any) => dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    ],
    // 表格/表单统一配置
    setting: {},
  }));

  const descriptionFields = [
    'user.name',
    'user.sex',
    'user.birthday',
    'user.phone',
    'user.email',
    'user.addressDetail',
  ];

  const descriptionMedicalRecordFields = [
    'mainComplaint',
    'nowSickness',
    'diagnostic',
    'notes',
    'doctor.user.name',
    'createdTime',
  ];

  // 患者信息
  const descriptionSchemas = computed(() => descriptionSchemaUtil(schema.value, descriptionFields));

  // 病例信息
  const descriptionMedicalRecordSchemas = computed(() =>
    descriptionSchemaUtil(schema.value, descriptionMedicalRecordFields),
  );

  return { descriptionSchemas, descriptionMedicalRecordSchemas };
};
