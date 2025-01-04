<template>
  <div>
    <n-grid x-gap="12" cols="4">
      <n-gi span="1">
        <BasicTable
          ref="tableRef"
          :size="'small'"
          :columns="columns"
          :filters="queryParams"
          :request="loadAppointments"
          :rowKey="(row: NaiveUI.RowData) => row.id"
          :pagination="false"
          :showAddBtn="false"
          :autoLoad="false"
          :showColumnsSetting="false"
          :row-props="rowProps"
        >
        </BasicTable>
      </n-gi>
      <n-gi span="3">
        <n-spin :show="showSpin">
          <n-card>
            <template #header>{{ nowAppointment?.patient?.user?.name }}</template>
            <template #header-extra>
              <n-space v-if="doctorScheduleId">
                <n-button type="success" @click="handleSave">保存</n-button>
                <n-button type="success" @click="handleFinished">完成就诊</n-button>
                <n-popconfirm @positive-click="handleNext">
                  <template #trigger>
                    <n-button type="primary">下一叫号</n-button>
                  </template>
                  是否确认完成该患者的诊查，继续下一叫号？
                </n-popconfirm>
              </n-space>
            </template>
            <template #default>
              <div class="min-h-560px">
                <BasicDescription
                  :data="nowAppointment"
                  :schemas="descriptionSchemas"
                  :bordered="false"
                  :column="3"
                ></BasicDescription>

                <n-divider></n-divider>

                <template
                  v-if="
                    nowAppointment?.status === 'UNFINISHED' || nowAppointment?.status === 'CALLED'
                  "
                >
                  <n-form
                    class="mt-20px"
                    :model="formModel"
                    :rules="rules"
                    label-placement="left"
                    label-width="auto"
                    require-mark-placement="right-hanging"
                  >
                    <n-form-item label="主诉" path="mainComplaint">
                      <n-input
                        type="textarea"
                        :autosize="{
                          minRows: 3,
                        }"
                        v-model:value="formModel.mainComplaint"
                      />
                    </n-form-item>
                    <n-form-item label="现病史" path="nowSickness">
                      <n-input
                        type="textarea"
                        :autosize="{
                          minRows: 3,
                        }"
                        v-model:value="formModel.nowSickness"
                      >
                      </n-input>
                    </n-form-item>
                    <n-form-item label="诊断结果" path="diagnostic">
                      <n-input
                        type="textarea"
                        :autosize="{
                          minRows: 3,
                        }"
                        v-model:value="formModel.diagnostic"
                      >
                      </n-input>
                    </n-form-item>
                  </n-form>
                  <div style="border: 1px solid #ccc">
                    <Toolbar
                      style="border-bottom: 1px solid #ccc"
                      :editor="editorRef"
                      :defaultConfig="toolbarConfig"
                      :mode="mode"
                    />
                    <Editor
                      style="height: 500px; overflow-y: hidden"
                      v-model="valueHtml"
                      :defaultConfig="editorConfig"
                      :mode="mode"
                      @onCreated="handleCreated"
                    />
                  </div>
                </template>
                <BasicDescription
                  v-else
                  :data="nowAppointment"
                  :schemas="descriptionSchemasDetail"
                  :bordered="false"
                  :column="1"
                ></BasicDescription>
              </div>
            </template>

            <template #footer>
              <n-divider></n-divider>

              <BasicDescription
                v-if="
                  nowAppointment?.status !== 'UNFINISHED' && nowAppointment?.status !== 'CALLED'
                "
                :data="nowAppointment"
                :schemas="descriptionDoctorSchemas"
                :column="2"
                :bordered="false"
              ></BasicDescription>
            </template>
          </n-card>
        </n-spin>
      </n-gi>
    </n-grid>
  </div>
</template>
<script setup lang="tsx">
import { AppointmentApi, DoctorScheduleApi, MedicalRecordApi } from '@/api';
import { BasicDescription, BasicTable } from '@/components';
import { IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { onMounted, ref } from 'vue';
import { useDoctorAppointmentSchema } from './schema';

defineOptions({ name: 'DoctorAppointment' });

const tableRef = ref<any>(null);
const queryParams = ref<Query.GetParams>({});
const doctorScheduleId = ref<number>(0);
const firstLoad = ref<boolean>(true);
const showSpin = ref<boolean>(true);

const nowAppointment = ref<Nullable<Appointment.Appointment>>(null);
const appointmentList = ref<Appointment.Appointment[]>([]);

const rowProps = (row: NaiveUI.RowData) => {
  return {
    style: {
      cursor: 'pointer',
    },
    onClick: () => {
      getAppointmentDetail(row.id);
    },
  };
};

// ----------富文本编辑器----------
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref('<p>hello</p>');
// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {};
const mode = 'simple';
const editorConfig: Partial<IEditorConfig> = {
  MENU_CONF: {},
};

// 创建编辑器实例
const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
// ----------富文本编辑器----------

// 表单数据
const formModel = ref({
  mainComplaint: '', // 主诉
  nowSickness: '', // 现病史
  diagnostic: '', // 诊断结果
});

const rules = {
  mainComplaint: [{ required: true, message: '请输入主诉', trigger: 'blur' }],
  nowSickness: [{ required: true, message: '请输入现病史', trigger: 'blur' }],
  diagnostic: [{ required: true, message: '请输入诊断结果', trigger: 'blur' }],
};

const schemaMethods = {
  handleCall: async (row: any) => {
    try {
      await AppointmentApi.call(row.id);
      await getAppointmentDetail(row.id);
      tableRef.value.reload();
    } catch (error: any) {
      window.$message.error(error);
    }
  },
};
const { columns, descriptionSchemas, descriptionSchemasDetail, descriptionDoctorSchemas } =
  useDoctorAppointmentSchema(schemaMethods);

// 加载当前排班，后端根据时间处理
const loadCurrentSchedule = async () => {
  try {
    console.log('[ 22 ] >', 11);
    const res = await DoctorScheduleApi.current();
    console.log('🚀 ~ loadCurrentSchedule ~ res:', res);

    if (res) {
      doctorScheduleId.value = res.id;
      if (doctorScheduleId.value) {
        tableRef.value.reload();
      }
    }
  } catch (error: any) {
    showSpin.value = false;
    window.$message.error(error);
  }
};

// 加载今天当前时间段的挂号列表
const loadAppointments = async (data: Query.GetParams) => {
  try {
    if (!doctorScheduleId.value) {
      return;
    }
    data.filters = { ...(data.filters || {}), ...{ doctorScheduleId: doctorScheduleId.value } };
    data.options = {
      showPagination: false,
    };
    const res = await AppointmentApi.doctorAppointmentList(data);
    console.log('🚀 ~ loadAppointments ~ res:', res);

    if (res) {
      appointmentList.value = res.data.filter(
        (item: Appointment.Appointment) => item.status === 'UNFINISHED' || item.status === 'CALLED',
      );
      // 第一次加载后，拿取第一个未完成的挂号
      if (firstLoad.value) {
        const [firstAppointment] = appointmentList.value;
        await getAppointmentDetail(firstAppointment.id);

        firstLoad.value = false;
      }
      return res;
    }
  } catch (error: any) {
    window.$message.error(error);
  }
};

// 强制至少一秒加载时间,优化点加载
const getAppointmentDetail = async (id: number) => {
  showSpin.value = true;
  resetForm();

  const apiRequest = AppointmentApi.detail(id);
  const timer = new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  try {
    const [res] = await Promise.all([apiRequest, timer]);
    nowAppointment.value = res;
    if (res && (res.status === 'UNFINISHED' || res.status === 'CALLED')) {
      // 如果是未完成的挂号，则加载其详情
      if (res.medicalRecord) {
        const { mainComplaint, nowSickness, diagnostic, notes } =
          nowAppointment.value.medicalRecord;
        formModel.value = {
          mainComplaint,
          nowSickness,
          diagnostic,
        };
        valueHtml.value = notes;
      }
    }
  } catch (error: any) {
    window.$message.error(error);
  } finally {
    showSpin.value = false;
  }
};

const handleSave = async () => {
  try {
    if (nowAppointment.value?.status !== 'CALLED') {
      window.$message.error('请先进行患者叫号！');
      return;
    }
    if (nowAppointment.value?.medicalRecord) {
      await MedicalRecordApi.update({
        ...formModel.value,
        id: nowAppointment.value?.medicalRecord.id,
      });
    } else {
      await MedicalRecordApi.create({
        ...formModel.value,
        notes: valueHtml.value,
        appointmentId: nowAppointment.value?.id as number,
        patientId: nowAppointment.value?.patientId as number,
      });
    }

    window.$message.success('保存成功');
  } catch (error: any) {
    window.$message.error(error);
  }
};

// 就诊完成
const handleFinished = async () => {
  try {
    await handleSave();
    await AppointmentApi.finish(nowAppointment.value?.id as number);
    tableRef.value.reload();
  } catch (error: any) {
    window.$message.error(error);
  }
};

// 下一叫号
const handleNext = async () => {
  try {
    await handleFinished();
    await schemaMethods.handleCall(appointmentList.value[0]);
    // await AppointmentApi.next(nowAppointment.value?.id as number);
    tableRef.value.reload();
  } catch (error: any) {
    window.$message.error(error);
  }
};

const resetForm = () => {
  formModel.value = {
    mainComplaint: '', // 主诉
    nowSickness: '', // 现病史
    diagnostic: '', // 诊断结果
  };
  valueHtml.value = '';
};

onMounted(() => {
  loadCurrentSchedule();
});
</script>
