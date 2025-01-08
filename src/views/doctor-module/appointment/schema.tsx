import { DepartmentApi } from '@/api';
import { AppointmentStatusOptions, AppointmentStatusTypeOptions, sexOptions } from '@/constants';
import { $t } from '@/locales/i18n';
import { columnsUtil, descriptionSchemaUtil } from '@/utils';
import dayjs from 'dayjs';
import { NButton, NSpace, NTag } from 'naive-ui';
import { RowData } from 'naive-ui/es/data-table/src/interface';
import { computed } from 'vue';

export const useDoctorAppointmentSchema = (methods: any = {}) => {
  const schema = computed(() => ({
    properties: [
      {
        key: 'medicalRecord.doctor.user.id',
        label: '医生',
        defaultValue: undefined,
        description: {
          render: (row: RowData) => {
            return row.medicalRecord?.doctor?.user?.name || '';
          },
        },
      },
      {
        key: 'patientId',
        label: '患者',
        defaultValue: undefined,
        table: {
          // render: (row: any) => row.doctorSchedule.doctor?.user?.name || '-',
          render: (row: RowData) => {
            return (
              <NButton text type="primary" onClick={() => methods.handleDetail(row)}>
                {row.patient?.user?.name}
              </NButton>
            );
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
          render: (row: any) => dayjs(row.appointmentDate).format('YYYY-MM-DD HH:mm:ss'),
        },
      },

      {
        key: 'medicalRecord.createdTime',
        label: '就诊时间',
        defaultValue: undefined,
        description: {
          render: (row: any) => dayjs(row.medicalRecord.createdTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },

      {
        key: 'operate',
        label: $t('common.operate'),
        table: {
          width: 100,
          render: (row: any) => (
            <NSpace justify="center">
              {row.status === 'UNFINISHED' && (
                <NButton type="error" ghost size="tiny" onClick={() => methods.handleCall(row)}>
                  叫号
                </NButton>
              )}
            </NSpace>
          ),
        },
      },
      {
        key: 'patient.user.name',
        label: '患者姓名',
      },
      {
        key: 'patient.user.sex',
        label: '性别',
        description: {
          render: (row: RowData) =>
            unref(sexOptions).find((item) => item.value === row.patient.user.sex)?.label,
        },
      },
      {
        key: 'patient.user.phone',
        label: '手机号',
        description: {
          render: (row: RowData) => row.patient.user.phone || '-',
        },
      },
      {
        key: 'patient.user.addressDetail',
        label: '详细地址',
        description: {
          render: (row: RowData) => row.patient.user.addressDetail || '-',
          span: 2,
        },
      },
      {
        key: 'patient.user.email',
        label: '电子邮箱',
        description: {
          render: (row: RowData) => row.patient.user.email || '-',
        },
      },
      {
        key: 'patient.user.birthday',
        label: '年龄',
        description: {
          render: (row: RowData) => {
            const birth = dayjs(row.patient.user.birthday);
            const today = dayjs();
            const age = today.diff(birth, 'year');
            return age ? `${age}岁` : '-';
          },
        },
      },
      {
        key: 'medicalRecord.mainComplaint',
        label: '主诉',
        description: {
          render: (row: any) => {
            const { medicalRecord } = row;
            return medicalRecord?.mainComplaint || '-';
          },
        },
      },
      {
        key: 'medicalRecord.nowSickness',
        label: '现病史',
        description: {
          render: (row: any) => {
            const { medicalRecord } = row;
            return medicalRecord?.nowSickness || '-';
          },
        },
      },
      {
        key: 'medicalRecord.diagnostic',
        label: '诊断结果',
        description: {
          render: (row: any) => {
            const { medicalRecord } = row;
            return medicalRecord?.diagnostic || '-';
          },
        },
      },
      {
        key: 'medicalRecord.notes',
        label: '详情',
        description: {
          render: (row: any) => {
            const { medicalRecord } = row;
            const notes = medicalRecord?.notes || '-';
            return <div innerHTML={notes}></div>;
          },
        },
      },
    ],
    // 表格/表单统一配置
    setting: {},
  }));

  // 表格和表单字段
  const tableFields = [
    'patientId',
    'doctorSchedule.date',
    'status',
    // 'appointmentDate',
    'operate',
  ];

  const descriptionFields = [
    'patient.user.name',
    'patient.user.sex',
    'patient.user.birthday',
    'patient.user.phone',
    'patient.user.email',
    'patient.user.addressDetail',
  ];

  const descriptionDetailFields = [
    'medicalRecord.mainComplaint',
    'medicalRecord.nowSickness',
    'medicalRecord.diagnostic',
    'medicalRecord.notes',
  ];

  const descriptionDoctorFields = ['medicalRecord.doctor.user.id', 'medicalRecord.createdTime'];

  // 表格列配置
  const columns = computed(() => columnsUtil(schema.value, tableFields));
  // 患者详细信息
  const descriptionSchemas = computed(() => descriptionSchemaUtil(schema.value, descriptionFields));
  // 病例信息
  const descriptionSchemasDetail = computed(() =>
    descriptionSchemaUtil(schema.value, descriptionDetailFields),
  );

  // 医生信息
  const descriptionDoctorSchemas = computed(() =>
    descriptionSchemaUtil(schema.value, descriptionDoctorFields),
  );

  return { columns, descriptionSchemas, descriptionSchemasDetail, descriptionDoctorSchemas };
};
